import os

def replace_in_file(file_path, search_text, replace_text):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content.replace(search_text, replace_text)
    
    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated: {file_path}")

def main():
    root_dir = r'd:\White Zero V1\White Zero V1\frontend\src'
    # Try both just in case
    search_list = ['http://localhost:5000/api', 'http://127.0.0.1:5000/api']
    replace = '/api'
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css')):
                for search in search_list:
                    replace_in_file(os.path.join(root, file), search, replace)

if __name__ == "__main__":
    main()
