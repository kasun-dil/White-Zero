import httpx
from bs4 import BeautifulSoup

def test_ddg_mobile(query):
    headers = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1"}
    r = httpx.post("https://html.duckduckgo.com/html/", data={'q': query}, headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    links = soup.select('.result__title a')
    print(f"Query: {query} -> Found: {len(links)} results")

test_ddg_mobile('0114777888')
