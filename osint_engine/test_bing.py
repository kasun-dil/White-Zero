import asyncio
from playwright.async_api import async_playwright

async def test_bing():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        query = 'kasun'
        search_url = f"https://www.bing.com/search?q=site:facebook.com+{query}"
        
        print(f"Testing Bing: {search_url}")
        await page.goto(search_url)
        await asyncio.sleep(5)
        
        # Extract results
        results = await page.query_selector_all('li.b_algo')
        print(f"Found {len(results)} Bing results.")
        for i, res in enumerate(results[:3]):
            h2 = await res.query_selector('h2')
            if h2:
                print(f"Result {i+1}: {await h2.inner_text()}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_bing())
