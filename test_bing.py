import httpx
from bs4 import BeautifulSoup

def get_bing(query):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
    r = httpx.get(f"https://www.bing.com/search?q={query}", headers=headers)
    soup = BeautifulSoup(r.text, 'html.parser')
    for li in soup.select('li.b_algo'):
        h2 = li.select_one('h2 a')
        if h2:
            print("Title:", h2.text)

get_bing('"+94 11 544 5000" OR "94115445000"')
