import httpx
from bs4 import BeautifulSoup
r = httpx.post('https://html.duckduckgo.com/html/', data={'q': '"+94 11 544 5000" OR "94115445000"'}, headers={'User-Agent': 'Mozilla/5.0'})
soup = BeautifulSoup(r.text, 'html.parser')
links = soup.select('.result__title a')
print([a.text for a in links])
