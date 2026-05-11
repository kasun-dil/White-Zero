import httpx
from bs4 import BeautifulSoup

def test_fb(query):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
    r = httpx.post("https://html.duckduckgo.com/html/", data={'q': query}, headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    links = soup.select('.result__title a')
    print(f"Query: {query} -> Found: {len(links)} results")

test_fb('site:facebook.com "0114777888"')
test_fb('site:facebook.com 0114777888')
