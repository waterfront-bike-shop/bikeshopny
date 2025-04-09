import os
import argparse
from PIL import Image

def resize_and_extend_image(input_path, output_path):
    # Open the image
    img = Image.open(input_path)

    # Resize the image to fit within 1024x696 while preserving aspect ratio using LANCZOS filter
    img.thumbnail((1024, 696), Image.LANCZOS)

    # Create a new image with the target size (1024x696) and a white background
    new_img = Image.new("RGBA", (1024, 696), (255, 255, 255, 0))  # Transparent or white background

    # Paste the resized image onto the new image (centered)
    left = (1024 - img.width) // 2
    top = (696 - img.height) // 2
    new_img.paste(img, (left, top))

    # If the image has a white background and is transparent, make the white background transparent
    if img.mode == 'RGBA':
        pixels = new_img.load()
        for i in range(new_img.width):
            for j in range(new_img.height):
                r, g, b, a = pixels[i, j]
                if r == 255 and g == 255 and b == 255:  # If pixel is white
                    pixels[i, j] = (255, 255, 255, 0)  # Make it transparent

    # Save the image as PNG or JPG based on transparency
    if new_img.getextrema()[3][1] == 0:  # If image has transparency (alpha channel)
        new_img.save(output_path, format="PNG", optimize=True)
    else:
        # Save as JPG and set a target quality for compression
        new_img.convert("RGB").save(output_path, format="JPEG", quality=85, optimize=True)

    # Compress the image further if the file is above 50KB
    iteration_count = 0
    max_iterations = 15
    while os.path.getsize(output_path) > 50000 and iteration_count < max_iterations:
        iteration_count += 1
        quality = 85 - iteration_count * 5  # Decrease quality more aggressively
        if quality < 10:
            quality = 10  # Don't go below quality 10 to avoid excessive quality loss
        new_img.convert("RGB").save(output_path, format="JPEG", quality=quality, optimize=True)
        
        print("Iteration:",iteration_count,"| Quality:",quality,"| File size:",os.path.getsize(output_path))

    # Check if the image is still above 50KB after 10 iterations
    if os.path.getsize(output_path) > 50000:
        print(f"Warning: The image is still above 50KB after {iteration_count} iterations. File saved at {output_path}")
    else:
        print(f"Image saved to {output_path}")

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description="Resize and extend an image to fit within 1024x696px with optional transparency")
    parser.add_argument('in_file', help="Path to the input image file")
    parser.add_argument('out_dir', nargs='?', default='out', help="Directory to save the output image (default: 'out')")

    # Parse arguments
    args = parser.parse_args()

    # Create output directory if it doesn't exist
    if not os.path.exists(args.out_dir):
        os.makedirs(args.out_dir)

    # Get the filename without extension
    base_name = os.path.splitext(os.path.basename(args.in_file))[0]

    # Define output file path
    output_path = os.path.join(args.out_dir, f"{base_name}-web.png")

    # Call the image processing function
    resize_and_extend_image(args.in_file, output_path)

if __name__ == "__main__":
    main()
