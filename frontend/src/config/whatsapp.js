// WhatsApp Business Configuration
export const WHATSAPP_CONFIG = {
  // Replace this with your actual WhatsApp business number
  // Format: +countrycode followed by number (no spaces)
  // Example: '+2348123456789' for Nigeria
  businessNumber: "+2348169200077",

  // Business details for WhatsApp messages
  businessName: "CodVeda Clothing Shop",

  // Default message templates
  orderMessageTemplate: {
    greeting: "🛒 *New Order Confirmation*",
    footer:
      "Please confirm this order and provide payment instructions. Thank you! 🙏",
  },
};

// Function to format WhatsApp message for orders
export const formatOrderMessage = (
  order,
  shippingAddress,
  orderItems,
  totalAmount
) => {
  return `${WHATSAPP_CONFIG.orderMessageTemplate.greeting}
    
*Order Number:* ${order.orderNumber}
*Customer:* ${shippingAddress.name}
*Phone:* ${shippingAddress.phone}

*Shipping Address:*
${shippingAddress.street}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}

*Order Items:*
${orderItems}

*Total Amount:* ₦${totalAmount.toLocaleString()}

*Payment Method:* Cash on Delivery

${WHATSAPP_CONFIG.orderMessageTemplate.footer}`;
};

// Function to create WhatsApp URL
export const createWhatsAppUrl = (message) => {
  const cleanNumber = WHATSAPP_CONFIG.businessNumber.replace("+", "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
