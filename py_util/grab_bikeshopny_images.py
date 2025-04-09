import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# URL of the page
url = "https://bikeshopny.com/"

# Create a folder to save the images
if not os.path.exists("public/images"):
    os.makedirs("public/images")

# Get the page content
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

# Find all image tags
img_tags = soup.find_all("img")

# Download all images
for img_tag in img_tags:
    img_url = img_tag.get("src")
    if img_url:
        # Handle relative URLs by joining with the base URL
        img_url = urljoin(url, img_url)

        # Extract the image filename from the URL
        img_name = os.path.basename(img_url)

        # Full path to save the image
        img_path = os.path.join("public/images", img_name)

        # Download the image and save it to the folder
        try:
            img_data = requests.get(img_url).content
            with open(img_path, "wb") as f:
                f.write(img_data)
            print(f"Downloaded {img_name}")
        except Exception as e:
            print(f"Failed to download {img_name}: {e}")

