import asyncio
from playwright.async_api import async_playwright

async def test_google_mobile():
    async with async_playwright() as p:
        # iPhone 12 user agent
        iphone_ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1"
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=iphone_ua, viewport={'width': 390, 'height': 844})
        page = await context.new_page()
        
        query = 'kasun'
        search_url = f"https://www.google.com/search?q=site:facebook.com+{query}"
        
        print(f"Testing Google Mobile: {search_url}")
        await page.goto(search_url)
        await asyncio.sleep(5)
        
        # In mobile, results are often in div[role="main"]
        results = await page.query_selector_all('div.xpd')
        print(f"Found {len(results)} mobile result containers.")
        for i, res in enumerate(results[:3]):
            title_el = await res.query_selector('div.vv77sc') or await res.query_selector('h3')
            if title_el:
                print(f"Result {i+1}: {await title_el.inner_text()}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_google_mobile())
