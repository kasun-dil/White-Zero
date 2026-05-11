import httpx
from bs4 import BeautifulSoup

def test_google_debug(query):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
    r = httpx.get(f"https://www.google.com/search?q={query}", headers=headers)
    print(f"Status Code: {r.status_code}")
    if "To continue, please type the characters below" in r.text or "Our systems have detected unusual traffic" in r.text:
        print("GOOGLE CAPTCHA DETECTED")
    else:
        print(r.text[:500])

test_google_debug('0114777888')
