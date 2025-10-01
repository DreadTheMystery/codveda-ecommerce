// Product Image Configuration
// This file helps manage local product images

export const IMAGE_CONFIG = {
  // Base path for local images (relative to public folder)
  basePath: '/images/products/',
  
  // Default fallback image
  fallbackImage: 'https://via.placeholder.com/400x300?text=No+Image',
  
  // Image dimensions for consistent sizing
  dimensions: {
    width: 400,
    height: 300
  }
};

// Helper function to get product image URL
export const getProductImageUrl = (imageName) => {
  if (!imageName) {
    return IMAGE_CONFIG.fallbackImage;
  }
  
  // If it's already a full URL (starts with http), return as is
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // For local images, prepend the base path
  return `${IMAGE_CONFIG.basePath}${imageName}`;
};

// Helper function to handle image loading errors
export const handleImageError = (event) => {
  event.target.src = IMAGE_CONFIG.fallbackImage;
  console.warn('Failed to load product image:', event.target.src);
};

// Recommended image naming convention
export const IMAGE_NAMING_GUIDE = {
  format: 'product-name-variant.jpg',
  examples: [
    't-shirt-red.jpg',
    'hoodie-black.jpg', 
    'jeans-blue.jpg',
    'shoes-white.jpg'
  ],
  supportedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  recommendedSize: '400x300 pixels',
  maxFileSize: '500KB for best performance'
};
