import httpx
from bs4 import BeautifulSoup

def test_google(query):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
    r = httpx.get(f"https://www.google.com/search?q={query}", headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    links = soup.select('div.g h3')
    print(f"Query: {query} -> Found: {len(links)} results")
    for a in links[:3]:
        print(f" - {a.text.strip()}")

test_google('0114777888')
