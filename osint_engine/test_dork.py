import asyncio
from playwright.async_api import async_playwright

async def test_dork():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        query = 'kasun'
        dork_query = f'site:facebook.com "{query}"'
        search_url = f"https://www.google.com/search?q={dork_query}"
        
        print(f"Testing URL: {search_url}")
        await page.goto(search_url)
        await asyncio.sleep(3)
        
        # Check if we are being blocked
        title = await page.title()
        print(f"Page Title: {title}")
        
        if "Google Search" not in title:
            print("Blocked by Google (possibly CAPTCHA)")
            # Try to take a screenshot to see what's happening
            await page.screenshot(path="google_test.png")
            print("Screenshot saved to google_test.png")
        else:
            results = await page.query_selector_all('div.g')
            print(f"Found {len(results)} result containers.")
            for i, res in enumerate(results[:3]):
                h3 = await res.query_selector('h3')
                if h3:
                    print(f"Result {i+1}: {await h3.inner_text()}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_dork())
