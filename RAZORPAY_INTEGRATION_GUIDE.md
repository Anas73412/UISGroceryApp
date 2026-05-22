# Razorpay Integration Guide for React Native Grocery App

## Installation

### 1. Install react-native-razorpay

```bash
cd GroceryApp
npm install react-native-razorpay
```

### 2. Android Setup

Add to your `android/app/build.gradle`:

```gradle
dependencies {
    implementation 'com.razorpay:checkout:1.6.37'
}
```

### 3. iOS Setup

```bash
cd ios
pod install
cd ..
```

## Implementation Files

### Files Created/Modified:

1. **paymentService.ts** - Core Razorpay integration

   - `initiatePayment()` - Opens Razorpay payment modal
   - `getUserDetailsForPayment()` - Fetches user info
   - `formatAmount()` - Formats amounts for display

2. **paymentErrorHandler.ts** - Comprehensive error handling

   - Maps Razorpay error codes to user-friendly messages
   - Handles retryable errors
   - Logs errors for debugging

3. **PaymentSuccessScreen.tsx** - Success screen component

   - Displays payment confirmation
   - Shows payment and order IDs
   - Auto-navigates after success

4. **CartScreen.tsx** - Updated checkout flow
   - Integrated Razorpay payment
   - Added error handling with retry logic
   - Clear cart on successful payment

## Configuration

### Add Your Razorpay Key

Update in `paymentService.ts`:

```typescript
key: 'YOUR_RAZORPAY_KEY_ID',
```

Get your key from: https://dashboard.razorpay.com/app/keys

### Optional: App Icon

Add app icon to `paymentService.ts`:

```typescript
image: require('../../assets/app-icon.png'),
```

### Theme Customization

Update color in `paymentService.ts`:

```typescript
theme: {
  color: '#FF5722', // Your app's primary color
}
```

## Payment Flow

```
User taps "Proceed to Checkout"
  ↓
Validate delivery address
  ↓
Get user details (email, phone, name)
  ↓
Create order (with mock ID for now)
  ↓
Open Razorpay payment modal
  ↓
User enters payment details
  ↓
Razorpay processes payment
  ↓
On Success:
  - Show success dialog
  - Clear cart
  - Navigate to home
  ↓
On Failure:
  - Show error message
  - Option to retry for network errors
```

## Testing with Razorpay Test Credentials

### Test Cards (Indian):

- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **Amex**: 378282246310005

### Test Credentials:

- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **OTP**: 111111 (when prompted)

## Backend Integration (Production)

### Create Order Endpoint

```typescript
POST /api/orders
Body: {
  amount: number,
  addressId: number,
  items: CartItem[]
}
Response: {
  orderId: string,
  amount: number
}
```

### Verify Payment Endpoint

```typescript
POST /api/verify-payment
Body: {
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string
}
Response: {
  status: 'success' | 'failure',
  orderId: string
}
```

## Production Checklist

- [ ] Get Razorpay Key ID and Key Secret from dashboard
- [ ] Add key to environment variables (don't hardcode)
- [ ] Implement backend `/api/orders` endpoint
- [ ] Implement backend `/api/verify-payment` endpoint
- [ ] Uncomment backend API calls in `CartScreen.tsx`
- [ ] Set up error logging service
- [ ] Test with actual test credentials
- [ ] Switch to live credentials in production
- [ ] Add order tracking page
- [ ] Set up webhooks for order updates
- [ ] Add payment receipt email

## Error Handling

The integration includes comprehensive error handling:

### Retryable Errors (Auto-retry):

- Network errors
- Timeout errors
- Bad request errors

### Non-retryable Errors:

- Payment cancelled
- Insufficient funds
- Card expired
- Invalid card details

## Customization

### Change Payment Modal Colors

Edit `paymentService.ts`:

```typescript
theme: {
  color: '#your-color',
}
```

### Add Custom Description

```typescript
await paymentService.initiatePayment({
  // ... other props
  description: 'Custom order description',
});
```

### Add Prefill Data

Update in `paymentService.ts`:

```typescript
prefill: {
  email: 'user@example.com',
  contact: '+919999999999',
  name: 'User Name',
}
```

## Troubleshooting

### Payment modal not opening

- Ensure react-native-razorpay is properly installed
- Check that Razorpay Key ID is set correctly
- Verify user has all required fields (email, phone, name)

### Payment failed with network error

- Check internet connection
- Retry payment (auto-retry for network errors)
- Verify backend API is accessible

### "Invalid order ID" error

- Ensure order ID is created on backend before payment
- Check order ID format matches Razorpay requirements

### Signature verification failed

- Implement proper signature verification on backend
- Ensure Key Secret is kept secure
- Verify HMAC-SHA256 calculation on backend

## Support & Documentation

- Razorpay Docs: https://razorpay.com/docs/
- React Native Razorpay: https://github.com/razorpay/react-native-razorpay
- Payment Flow Guide: https://razorpay.com/docs/payments/payment-gateway/web-integration/
