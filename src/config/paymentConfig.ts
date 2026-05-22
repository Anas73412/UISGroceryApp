/**
 * Payment Configuration
 * Razorpay Key ID is loaded from app config (GATEWAY_KEY_ID), not hardcoded here.
 */

export const PaymentConfig = {
  currency: 'INR',
  themeColor: '#FF5722',
  maxRetryAttempts: 2,
  paymentTimeout: 30000,
  /** Razorpay minimum charge in paise (₹1) */
  minAmountPaise: 100,
  defaultDescription: 'Grocery Order Payment',
  successRedirect: 'HomeTab',
};

/** True only for order IDs created by your backend via Razorpay Orders API */
export function isServerRazorpayOrderId(orderId?: string | null): boolean {
  if (!orderId?.trim()) return false;
  // Client-generated ids like order_1734567890 must not be sent
  return /^order_[a-zA-Z0-9]{8,}$/.test(orderId.trim());
}

export function validateRazorpayKeyId(keyId?: string | null): string | null {
  const key = keyId?.trim() ?? '';
  if (!key) {
    return 'Payment gateway key is missing. Open the app online once so settings can sync, then try again.';
  }
  if (!key.startsWith('rzp_')) {
    return 'Payment gateway key is invalid. Contact support.';
  }
  return null;
}

export function amountToPaise(amountInRupees: number): number {
  const paise = Math.round(amountInRupees * 100);
  return Math.max(PaymentConfig.minAmountPaise, paise);
}

/**
 * Build options for react-native-razorpay.
 * Omit order_id unless the server returned a real Razorpay order id.
 */
export function getPaymentOptions(params: {
  amount: number;
  razorKeyId: string;
  orderId?: string;
  email: string;
  phone: string;
  userName: string;
  description?: string;
}) {
  const amountPaise = amountToPaise(params.amount);
  const contact = normalizeContactForRazorpay(params.phone);

  const options: Record<string, unknown> = {
    description: params.description || PaymentConfig.defaultDescription,
    currency: PaymentConfig.currency,
    amount: amountPaise,
    key: params.razorKeyId.trim(),
    name: 'UIS Groceries',
    prefill: {
      email: params.email,
      contact,
      name: params.userName,
    },
    theme: {
      color: PaymentConfig.themeColor,
    },
  };

  if (isServerRazorpayOrderId(params.orderId)) {
    options.order_id = params.orderId!.trim();
  }

  return options;
}

/** Razorpay expects 10-digit Indian mobile in prefill.contact */
export function normalizeContactForRazorpay(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.length >= 10 ? digits.slice(-10) : '9999999999';
}

export function buildPaymentEmail(
  email: string | null | undefined,
  userId: number,
  mobile: string,
): string {
  const trimmed = email?.trim();
  if (trimmed && trimmed.includes('@')) return trimmed;
  const phone = normalizeContactForRazorpay(mobile);
  return `user${userId || phone}@uis.groceries`;
}
