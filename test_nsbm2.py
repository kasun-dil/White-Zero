import asyncio
import httpx
from bs4 import BeautifulSoup
import json

async def get_search_results(query):
    results = []
    try:
        search_url = "https://html.duckduckgo.com/html/"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
        async with httpx.AsyncClient(headers=headers, timeout=15.0, follow_redirects=True) as client:
            response = await client.post(search_url, data={'q': query})
            soup = BeautifulSoup(response.text, 'html.parser')
            links = soup.select('.result__title a')
            for a in links:
                results.append(a.text)
    except Exception as e:
        pass
    return results

async def main():
    print(await get_search_results('"+94 11 544 5000"'))
    print(await get_search_results('0115445000'))
    print(await get_search_results('94115445000'))

asyncio.run(main())
