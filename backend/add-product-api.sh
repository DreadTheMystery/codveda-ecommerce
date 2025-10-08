#!/bin/bash

# Example script to add a product via API
# Make sure your server is running on localhost:4001

# First, login as admin to get auth token
echo "🔐 Logging in as admin..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "abdulgafarridwan@gmail.com",
    "password": "admin123"
  }')

# Extract token from response
TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token. Make sure server is running and credentials are correct."
  exit 1
fi

echo "✅ Successfully authenticated"

# Add a new product
echo "🛍️ Adding new product..."
curl -X POST http://localhost:4001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "New Product via API",
    "description": "This product was added using the API endpoint",
    "price": 29.99,
    "image_url": "/images/products/new-product.jpg",
    "category": "Test Category",
    "stock": 10
  }'

echo ""
echo "✅ Product added successfully!"
