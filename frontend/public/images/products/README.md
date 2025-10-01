# Product Images Directory

This directory contains product images for the e-commerce store.

## File Structure
```
/frontend/public/images/products/
├── t-shirt-red.jpg
├── t-shirt-blue.jpg
├── hoodie-black.jpg
├── hoodie-gray.jpg
├── jeans-blue.jpg
├── jeans-black.jpg
├── shoes-white.jpg
├── shoes-black.jpg
└── accessories-watch.jpg
```

## Adding Your Own Images

1. **Copy your images to this folder:**
   - Navigate to: `/frontend/public/images/products/`
   - Copy your product images here

2. **Rename your images using this format:**
   - `product-type-color.jpg`
   - Examples: `t-shirt-red.jpg`, `hoodie-black.jpg`

3. **Recommended image specifications:**
   - **Size**: 400x300 pixels (4:3 aspect ratio)
   - **Format**: JPG, PNG, or WebP
   - **File size**: Under 500KB for best performance
   - **Quality**: High quality but optimized for web

4. **Update your product data:**
   - In your database or product management system
   - Set the `image_url` field to just the filename
   - Example: `"image_url": "t-shirt-red.jpg"`

## How It Works

- **Local images**: Just use the filename (e.g., `t-shirt-red.jpg`)
- **Online images**: Full URLs still work (e.g., `https://example.com/image.jpg`)
- **Fallback**: If image doesn't load, shows placeholder automatically

## Image Optimization Tips

1. **Resize before uploading**: Use tools like:
   - GIMP (free)
   - Photoshop
   - Online tools like TinyPNG

2. **Compress images**: Reduce file size without losing quality
3. **Use consistent naming**: Makes management easier
4. **Keep aspect ratio**: 4:3 works best for the product grid
