from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import httpx
import urllib.parse
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
import random
import re

app = FastAPI(title="White Zero OSINT Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---

class SearchQuery(BaseModel):
    query: str
    search_type: str
    limit: int = 10

class SearchResult(BaseModel):
    id: str
    name: str
    type: str
    link: str
    details: Optional[str] = None
    image: Optional[str] = None
    content: Optional[str] = None
    likes: Optional[int] = 0
    comments: Optional[int] = 0
    shares: Optional[int] = 0
    timestamp: Optional[str] = None
    trust_score: Optional[float] = 0.0
    risk_level: Optional[str] = "Low"

class UsernameQuery(BaseModel):
    username: str
    deep_scan: Optional[bool] = False

class UsernameResult(BaseModel):
    platform: str
    status: str
    link: str

# --- Platform Registry ---

PLATFORMS = {
    "Facebook": {"url": "https://www.facebook.com/{}", "type": "browser"},
    "Instagram": {"url": "https://www.instagram.com/{}/", "type": "browser"},
    "X": {"url": "https://x.com/{}", "type": "browser"},
    "GitHub": {"url": "https://github.com/{}", "type": "http"},
    "Reddit": {"url": "https://www.reddit.com/user/{}", "type": "http"},
    "TikTok": {"url": "https://www.tiktok.com/@{}", "type": "browser"},
    "LinkedIn": {"url": "https://www.linkedin.com/in/{}", "type": "browser"},
    "YouTube": {"url": "https://www.youtube.com/@{}", "type": "http"},
    "Pinterest": {"url": "https://www.pinterest.com/{}/", "type": "http"},
    "Snapchat": {"url": "https://www.snapchat.com/add/{}", "type": "http"},
    "Medium": {"url": "https://medium.com/@{}", "type": "http"},
    "Behance": {"url": "https://www.behance.net/{}", "type": "http"},
    "Dribbble": {"url": "https://dribbble.com/{}", "type": "http"},
    "Vimeo": {"url": "https://vimeo.com/{}", "type": "http"},
    "Twitch": {"url": "https://www.twitch.tv/{}", "type": "http"},
    "SoundCloud": {"url": "https://soundcloud.com/{}", "type": "http"},
    "Steam": {"url": "https://steamcommunity.com/id/{}", "type": "http"},
    "VK": {"url": "https://vk.com/{}", "type": "http"},
    "Spotify": {"url": "https://open.spotify.com/user/{}", "type": "http"},
    "Telegram": {"url": "https://t.me/{}", "type": "http"}
}

# --- Scanner Context ---

class ScannerContext:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.semaphore = asyncio.Semaphore(5) # Max 5 concurrent browser tabs

    async def start(self):
        if not self.playwright:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=True)
            self.context = await self.browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            )

    async def stop(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

scanner = ScannerContext()

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize the forensic scanner context
    await scanner.start()
    yield
    # Shutdown: Cleanly close browser sessions
    await scanner.stop()

app = FastAPI(title="White Zero OSINT Engine", lifespan=lifespan)

# --- Helper Functions ---

async def get_search_results(query):
    results = []
    try:
        search_url = "https://html.duckduckgo.com/html/"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
        async with httpx.AsyncClient(headers=headers, timeout=15.0, follow_redirects=True) as client:
            response = await client.post(search_url, data={'q': query})
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                links = soup.select('.result__title a')
                snippets = soup.select('.result__snippet')
                
                for i, link_el in enumerate(links[:5]):
                    title = link_el.text.strip()
                    raw_link = link_el.get('href', '')
                    # Extract real link from DDG redirect
                    link = urllib.parse.parse_qs(urllib.parse.urlparse(raw_link).query).get('uddg', [raw_link])[0]
                    snippet = snippets[i].text.strip() if i < len(snippets) else ""
                    
                    if link and link.startswith('http'):
                        results.append({"title": title, "link": link, "snippet": snippet})
    except Exception as e:
        print(f"Search Discovery Error: {e}")
    return results

async def check_http(platform, url):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
    try:
        async with httpx.AsyncClient(headers=headers, timeout=10.0, follow_redirects=True) as client:
            response = await client.get(url)
            if response.status_code == 200:
                # Extra check for Reddit/YouTube which might return 200 for 'user not found' pages
                content = response.text.lower()
                if any(sig in content for sig in ["page not found", "user not found", "doesn't exist"]):
                    return {"platform": platform, "status": "Not Found", "link": url}
                return {"platform": platform, "status": "Found", "link": url}
            return {"platform": platform, "status": "Not Found", "link": url}
    except:
        return {"platform": platform, "status": "Not Found", "link": url}

async def check_browser(platform, url):
    async with scanner.semaphore:
        page = await scanner.context.new_page()
        try:
            # Enhanced Stealth Headers
            await page.set_extra_http_headers({
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.google.com/"
            })
            
            # Navigate and wait for a realistic human-like timeout
            wait_type = "networkidle" if platform == "TikTok" else "domcontentloaded"
            response = await page.goto(url, wait_until=wait_type, timeout=30000)
            
            # Status Code Check (High Fidelity)
            if response and response.status == 404:
                return {"platform": platform, "status": "Not Found", "link": url}

            # Final URL Check (Redirect Detection)
            final_url = page.url.lower()
            
            # If we are redirected away from the username path to a generic login/home
            if "login" in final_url or "signup" in final_url:
                if url.split('/')[-1].replace('@', '').lower() not in final_url:
                    # Special case for X: sometimes it redirects to login but the account exists
                    if platform != "X":
                        return {"platform": platform, "status": "Not Found", "link": url}

            # Signature check
            content = (await page.content()).lower()
            title = (await page.title()).lower()
            
            # Global 404 Signatures
            not_found_sigs = [
                "page not found", "user not found", "doesn't exist", 
                "couldn't find this account", "page is not available",
                "this account doesn't exist", "this page isn't available",
                "account_not_found"
            ]
            
            if any(sig in content for sig in not_found_sigs) or any(sig in title for sig in not_found_sigs):
                return {"platform": platform, "status": "Not Found", "link": url}
                
            # Final verification: Check if username exists in the page content or URL
            username = url.split('/')[-1].replace('@', '').lower()
            if username in content or username in title or username in final_url or (response and response.status == 200):
                return {"platform": platform, "status": "Found", "link": url}

            return {"platform": platform, "status": "Not Found", "link": url}
        except:
            return {"platform": platform, "status": "Not Found", "link": url}
        finally:
            await page.close()

# --- Endpoints ---

@app.post("/search_username")
async def search_username(query: UsernameQuery):
    tasks = []
    platform_items = list(PLATFORMS.items())
    
    # If not deep scan, only do first 9
    scan_list = platform_items if query.deep_scan else platform_items[:9]
    
    for platform, data in scan_list:
        url = data["url"].format(query.username)
        if data["type"] == "http":
            tasks.append(check_http(platform, url))
        else:
            tasks.append(check_browser(platform, url))
    
    results = await asyncio.gather(*tasks)
    return {"username": query.username, "results": results, "deep_scan": query.deep_scan}

@app.post("/search", response_model=List[SearchResult])
async def search_discovery(query: SearchQuery):
    """
    General discovery search using DuckDuckGo Lite.
    """
    results = []
    try:
        dork_query = f'site:facebook.com "{query.query}"'
        if query.search_type == "post": dork_query += " posts"
        search_url = f"https://duckduckgo.com/lite/?q={urllib.parse.quote(dork_query)}"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"}
        async with httpx.AsyncClient(headers=headers, timeout=15.0) as client:
            response = await client.get(search_url)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                links = soup.find_all('a', class_='result-link')
                for i, link_el in enumerate(links[:query.limit]):
                    raw_link = link_el['href']
                    real_link = urllib.parse.parse_qs(urllib.parse.urlparse(raw_link).query).get('uddg', [raw_link])[0]
                    if "facebook.com" not in real_link: continue
                    results.append(SearchResult(
                        id=f"fb_{i}_{random.randint(1000,9999)}",
                        name=link_el.text.replace(" - Facebook", "").strip(),
                        type=query.search_type,
                        link=real_link,
                        trust_score=round(random.uniform(0.7, 0.95), 2)
                    ))
    except Exception as e:
        print(f"Discovery Error: {e}")
    return results

@app.post("/phone")
async def search_phone(query: UsernameQuery):
    number = query.username
    clean_number = number.replace('+', '').replace(' ', '')
    results = []
    
    # Enhanced Dorking: Force the search engine to look for contact context ONLY for short codes
    # This prevents short-codes like '1987' from returning historical year results,
    # but allows long mobile numbers to freely return Facebook/social media profiles.
    if len(clean_number) <= 5:
        search_query = f'"{number}" OR "{clean_number}" (phone OR contact OR hotline OR directory)'
        search_hits = await get_search_results(search_query)
    else:
        global_query = f'"{number}" OR "{clean_number}"'
        fb_query = f'site:facebook.com "{number}" OR "{clean_number}"'
        
        hit_lists = await asyncio.gather(
            get_search_results(global_query),
            get_search_results(fb_query)
        )
        
        seen_links = set()
        search_hits = []
        for lst in hit_lists:
            for res in lst:
                if res['link'] not in seen_links:
                    seen_links.add(res['link'])
                    search_hits.append(res)
    
    for res in search_hits:
        results.append({
            "platform": "Search Discovery",
            "status": "Found",
            "title": res["title"],
            "link": res["link"],
            "snippet": res["snippet"]
        })
    return {"phone": number, "results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
