# WhatsApp Payment Integration

This e-commerce application includes WhatsApp integration for payment confirmation after orders are placed.

## Setup Instructions

### 1. Configure Your WhatsApp Business Number

Edit the file `/frontend/src/config/whatsapp.js` and update your business WhatsApp number:

```javascript
export const WHATSAPP_CONFIG = {
  // Replace with your actual WhatsApp business number
  businessNumber: "+2348123456789", // Example: Nigeria number

  // You can also customize business name
  businessName: "CodVeda Clothing Shop",
};
```

### 2. WhatsApp Number Format

- Include country code with `+` prefix
- No spaces or special characters except `+`
- Examples:
  - Nigeria: `+2348123456789`
  - USA: `+1234567890`
  - UK: `+447123456789`
  - India: `+919876543210`

### 3. How It Works

1. Customer places an order successfully
2. System shows confirmation notification
3. After 2 seconds, WhatsApp opens automatically
4. Pre-filled message contains:
   - Order number
   - Customer details
   - Shipping address
   - Order items with quantities and prices
   - Total amount
   - Payment method

### 4. WhatsApp Message Format

The system sends a formatted message like this:

```
🛒 New Order Confirmation

Order Number: ORD-20250101-001
Customer: John Doe
Phone: +2348123456789

Shipping Address:
123 Main Street
Lagos, Lagos State 100001

Order Items:
• T-Shirt (₦5,000) x 2 = ₦10,000
• Jeans (₦8,000) x 1 = ₦8,000

Total Amount: ₦18,000

Payment Method: Cash on Delivery

Please confirm this order and provide payment instructions. Thank you! 🙏
```

### 5. Testing

1. Place a test order
2. Check if WhatsApp opens with the correct message
3. Verify your business number receives the message
4. Adjust the configuration if needed

### 6. Customization

You can customize:

- Business name in `whatsapp.js`
- Message templates in `whatsapp.js`
- Redirect delay (currently 2 seconds) in `Cart.jsx`

### 7. Requirements

- WhatsApp must be installed on the customer's device
- Business WhatsApp number must be active
- Internet connection required for both customer and business

## Support

If you need help configuring the WhatsApp integration, check:

1. WhatsApp Business API documentation
2. Ensure your number format is correct
3. Test with a working WhatsApp number first
