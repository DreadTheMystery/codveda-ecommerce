#!/bin/bash

# Image Processing Helper Script
# This script helps you resize and optimize images for your e-commerce store

echo "🖼️  Product Image Helper Script"
echo "================================"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it first:"
    echo "   Ubuntu/Debian: sudo apt install imagemagick"
    echo "   macOS: brew install imagemagick"
    echo "   Windows: Download from https://imagemagick.org/"
    exit 1
fi

# Create products directory if it doesn't exist
mkdir -p "$(dirname "$0")/public/images/products"

echo "✅ ImageMagick found!"
echo ""
echo "📁 Place your original images in a folder and run this script"
echo "   It will resize and optimize them for your store"
echo ""

# Function to process images
process_images() {
    local input_dir="$1"
    local output_dir="$(dirname "$0")/public/images/products"
    
    if [ ! -d "$input_dir" ]; then
        echo "❌ Directory $input_dir not found"
        return 1
    fi
    
    echo "🔄 Processing images from: $input_dir"
    echo "📤 Output directory: $output_dir"
    echo ""
    
    # Process each image file
    for img in "$input_dir"/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            name="${filename%.*}"
            
            echo "📸 Processing: $filename"
            
            # Resize to 400x300 and optimize
            convert "$img" \
                -resize 400x300^ \
                -gravity center \
                -extent 400x300 \
                -quality 85 \
                -strip \
                "$output_dir/${name}.jpg"
            
            echo "   ✅ Saved as: ${name}.jpg"
        fi
    done
    
    echo ""
    echo "🎉 All images processed successfully!"
    echo "📋 Next steps:"
    echo "   1. Check the images in: $output_dir"
    echo "   2. Rename them using format: product-type-color.jpg"
    echo "   3. Update your product database with the new filenames"
}

# Main script
if [ $# -eq 0 ]; then
    echo "Usage: $0 <input-directory>"
    echo ""
    echo "Example:"
    echo "  $0 ~/Pictures/product-photos"
    echo ""
    echo "This will resize all images in the directory to 400x300px"
    echo "and save them optimized for web use."
else
    process_images "$1"
fi
