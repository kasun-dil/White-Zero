import httpx
from bs4 import BeautifulSoup

def test_ddg_lite():
    query = 'kasun'
    search_url = f"https://duckduckgo.com/lite/?q=site:facebook.com+{query}"
    
    print(f"Testing DDG Lite: {search_url}")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"}
    
    with httpx.Client(headers=headers, follow_redirects=True) as client:
        response = client.get(search_url)
        print(f"Status Code: {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.find_all('a', class_='result-link')
        
        print(f"Found {len(links)} DDG Lite links.")
        for i, link in enumerate(links[:3]):
            print(f"Result {i+1}: {link.text.strip()} -> {link['href']}")

if __name__ == "__main__":
    test_ddg_lite()
