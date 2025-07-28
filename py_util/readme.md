# Image Reducer

*(Assumes you created the virtual enviroment, and are working from that, and have installed the libraries from requirements.txt)*

Single File
`python3 img_reducer_brm.py in/KHS-urban-xscape.jpg`

Outputs to an /out folder

jpg, webp, heif, aivf, gif, and more...

- get the image file to Bike Rental Manager's specs for mobile
- Image should be 1024 by 696px

Ideally the image should be a PNG with a transparent background or a JPG with a white background

The file size should be small to work well on mobiles, ideally 50Kb or less

## Prep road bikes and text for Bike Rental Manager 
0. Resize the image to BRM's specs using the img_reducer_brm.py script. Instructions above.
1. Use ChatGPT to help get the data similar to the rest of the road bikes
`https://chatgpt.com/share/68878618-de10-8008-bf1d-360604da77a7`
2. Add bike stats to Road Bikes Google Sheets document. (csv copy added to this repo)
3. Feed stats into ChatGPT, and ask it to produce a listing in the same style as past listings.
4. Log into BRM and go to the bike icon 'Inventory & Prices'
5. Click on the '+' in the Road Bikes row to 'Add to Product Family'
6. Name the new bike something like "53cm Bianchi Eros" --> add image --> add price categort (aluminum or carbon) --> add in description.
7. Under the new 'Product Family' for that road bike, click the '+' to add the bike into the inventory and make it reservable.
8. Add in the size of the bike. The road bikes are 1-1. Otherwise, like for the hybrid rentals, there are multiple sizes here.
9. Click on the up arrow to add a bike to the inventory. Now it is reservable.






