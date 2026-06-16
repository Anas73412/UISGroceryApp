/**
 * Payment Error Handler
 * Handles various payment errors and provides user-friendly messages
 */

export interface PaymentError {
  code: string;
  description: string;
  message: string;
  originalError?: unknown;
}

export const PaymentErrorCodes = {
  CANCELLED: 'CANCELLED',
  BAD_REQUEST_ERROR: 'BAD_REQUEST_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SIGNATURE_VERIFICATION_FAILED: 'SIGNATURE_VERIFICATION_FAILED',
  INVALID_ORDER_ID: 'INVALID_ORDER_ID',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  PAYMENT_DECLINED: 'PAYMENT_DECLINED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  CARD_EXPIRED: 'CARD_EXPIRED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export const paymentErrorHandler = {
  getErrorMessage(code: string, description?: string): string {
    const errorMessages: Record<string, string> = {
      [PaymentErrorCodes.CANCELLED]:
        'Payment was cancelled. You can try again when you are ready.',
      [PaymentErrorCodes.BAD_REQUEST_ERROR]:
        'Invalid payment request. Please check your details and try again.',
      [PaymentErrorCodes.NETWORK_ERROR]:
        'Network error occurred. Please check your internet connection and try again.',
      [PaymentErrorCodes.TIMEOUT_ERROR]:
        'Payment request timed out. Please try again.',
      [PaymentErrorCodes.SIGNATURE_VERIFICATION_FAILED]:
        'Payment verification failed. Please contact support.',
      [PaymentErrorCodes.INVALID_ORDER_ID]: 'Invalid order. Please try again.',
      [PaymentErrorCodes.INVALID_AMOUNT]:
        'Invalid payment amount. Please try again.',
      [PaymentErrorCodes.USER_NOT_FOUND]:
        'User information not found. Please log in again.',
      [PaymentErrorCodes.PAYMENT_DECLINED]:
        'Payment was declined by your bank. Please try another payment method.',
      [PaymentErrorCodes.INSUFFICIENT_FUNDS]:
        'Insufficient funds. Please check your account balance.',
      [PaymentErrorCodes.CARD_EXPIRED]:
        'Your card has expired. Please use another payment method.',
      [PaymentErrorCodes.UNKNOWN_ERROR]:
        description || 'Something went wrong with your payment. Please try again.',
    };

    return (
      errorMessages[code] || errorMessages[PaymentErrorCodes.UNKNOWN_ERROR]
    );
  },

  getErrorTitle(code: string): string {
    const titleMap: Record<string, string> = {
      [PaymentErrorCodes.CANCELLED]: 'Payment Cancelled',
      [PaymentErrorCodes.BAD_REQUEST_ERROR]: 'Invalid Request',
      [PaymentErrorCodes.NETWORK_ERROR]: 'Network Error',
      [PaymentErrorCodes.TIMEOUT_ERROR]: 'Timeout',
      [PaymentErrorCodes.SIGNATURE_VERIFICATION_FAILED]: 'Verification Failed',
      [PaymentErrorCodes.INVALID_ORDER_ID]: 'Invalid Order',
      [PaymentErrorCodes.INVALID_AMOUNT]: 'Invalid Amount',
      [PaymentErrorCodes.USER_NOT_FOUND]: 'User Error',
      [PaymentErrorCodes.PAYMENT_DECLINED]: 'Payment Declined',
      [PaymentErrorCodes.INSUFFICIENT_FUNDS]: 'Insufficient Funds',
      [PaymentErrorCodes.CARD_EXPIRED]: 'Card Expired',
      [PaymentErrorCodes.UNKNOWN_ERROR]: 'Payment Failed',
    };

    return titleMap[code] || 'Payment Failed';
  },

  isRetryable(code: string): boolean {
    const retryableErrors = [
      PaymentErrorCodes.NETWORK_ERROR,
      PaymentErrorCodes.TIMEOUT_ERROR,
      PaymentErrorCodes.BAD_REQUEST_ERROR,
    ];

    return retryableErrors.includes(code);
  },

  mapError(error: { code?: string; description?: string; message?: string }): PaymentError {
    if (error.code === PaymentErrorCodes.CANCELLED) {
      return {
        code: PaymentErrorCodes.CANCELLED,
        description: 'User cancelled the payment',
        message: this.getErrorMessage(PaymentErrorCodes.CANCELLED),
        originalError: error,
      };
    }

    const code = error.code || PaymentErrorCodes.UNKNOWN_ERROR;
    const description = error.description || error.message || 'Unknown error';

    return {
      code,
      description,
      message: this.getErrorMessage(code, description),
      originalError: error,
    };
  },

  logError(error: PaymentError) {
    console.error('[PaymentError]', {
      code: error.code,
      description: error.description,
      message: error.message,
      timestamp: new Date().toISOString(),
      originalError: error.originalError,
    });
  },
};
