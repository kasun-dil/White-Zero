import httpx
import json
import asyncio

async def test_username_search(username):
    print(f"Testing Forensic Username Search for: {username}")
    url = "http://localhost:8001/search_username"
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(url, json={"username": username})
            if response.status_code == 200:
                data = response.json()
                print(f"\nScan results for @{data['username']}:")
                found = [r for r in data['results'] if r['status'] == 'Found']
                not_found = [r for r in data['results'] if r['status'] == 'Not Found']
                
                print(f"TOTAL PLATFORMS SCANNED: {len(data['results'])}")
                print(f"ACCOUNTS DISCOVERED: {len(found)}")
                print(f"CLEAN PROFILES: {len(not_found)}")
                
                if found:
                    print("\nDiscovered Intelligence Nodes:")
                    for res in found:
                        print(f"[+] {res['platform']}: {res['link']}")
                else:
                    print("\n[!] No public digital footprint detected.")
            else:
                print(f"Error: Status Code {response.status_code}")
                print(response.text)
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_username_search("kasun-dil"))
