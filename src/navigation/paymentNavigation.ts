/**
 * Payment Navigation Setup
 * 
 * Add this to your navigation stack to enable PaymentSuccessScreen navigation
 */

import { PaymentSuccessScreen } from '../features/cart/PaymentSuccessScreen';

// Example: Add to your navigation stack
export const paymentNavigation = {
  // Add this to your navigation parameters type
  navigatorParamList: {
    PaymentSuccess: {
      paymentId: string;
      orderId: string;
      amount: number;
      onComplete?: () => void;
    };
  },

  // Add this screen to your navigator
  screenConfig: {
    name: 'PaymentSuccess',
    component: PaymentSuccessScreen,
    options: {
      title: 'Payment Successful',
      headerShown: false, // We have our own header
      animationEnabled: true,
      gestureEnabled: false, // Prevent swipe back
    },
  },

  // Usage in CartScreen:
  // navigation.navigate('PaymentSuccess', {
  //   paymentId: 'pay_123456789',
  //   orderId: 'order_123456789',
  //   amount: 500.50,
  //   onComplete: () => {
  //     // Clear cart and navigate
  //     cartController.clearCart();
  //     navigation.navigate('HomeTab');
  //   }
  // });
};

/**
 * Quick Integration Steps:
 * 
 * 1. Import PaymentSuccessScreen in your navigation file
 * 2. Add to your stack navigator:
 *    ```
 *    <Stack.Screen
 *      name="PaymentSuccess"
 *      component={PaymentSuccessScreen}
 *      options={{
 *        title: 'Payment Successful',
 *        headerShown: false,
 *        gestureEnabled: false,
 *      }}
 *    />
 *    ```
 * 
 * 3. In CartScreen, after successful payment:
 *    ```
 *    navigation.navigate('PaymentSuccess', {
 *      paymentId: paymentResponse.razorpay_payment_id,
 *      orderId: paymentResponse.razorpay_order_id,
 *      amount: totalAmount,
 *      onComplete: () => {
 *        cartController.clearCart();
 *        navigation.navigate('HomeTab');
 *      }
 *    });
 *    ```
 * 
 * 4. Alternatively, use the auto-navigation version (no onComplete callback)
 *    which auto-navigates to Home after 3 seconds
 */
