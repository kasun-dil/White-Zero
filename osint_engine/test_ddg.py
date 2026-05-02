import asyncio
from playwright.async_api import async_playwright

async def test_ddg():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        query = 'kasun'
        search_url = f"https://duckduckgo.com/?q=site:facebook.com+{query}&t=h_&ia=web"
        
        print(f"Testing DDG: {search_url}")
        await page.goto(search_url)
        await asyncio.sleep(5)
        
        # Extract results
        results = await page.query_selector_all('article')
        print(f"Found {len(results)} DDG articles.")
        for i, res in enumerate(results[:3]):
            title_el = await res.query_selector('h2')
            if title_el:
                print(f"Result {i+1}: {await title_el.inner_text()}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_ddg())
