import httpx
from bs4 import BeautifulSoup

def test_ddg_debug(query):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
    r = httpx.post("https://html.duckduckgo.com/html/", data={'q': query}, headers=headers)
    print(r.text[:1000])

test_ddg_debug('0114777888')
