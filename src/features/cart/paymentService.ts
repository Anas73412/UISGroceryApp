import RazorpayCheckout from 'react-native-razorpay';
import { sessionStore } from '../../store/sessionStore';
import { CONFIG_KEYS, RUPEE_SIGN, SUCCESS } from '../../utils/constants';
import {
  buildPaymentEmail,
  getPaymentOptions,
  normalizeContactForRazorpay,
  validateRazorpayKeyId,
} from '../../config/paymentConfig';
import ConfigRepository from '../../data/repositories/ConfigRepository';
import { splashService } from '../splash/service';

export interface PaymentOptions {
  amount: number;
  /** Only pass when your API returned a Razorpay Orders API order_id */
  orderId?: string;
  email: string;
  phone: string;
  userName: string;
  description?: string;
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

async function resolveRazorpayKeyId(): Promise<string> {
  let row = await ConfigRepository.getConfigByKeyFromDB(
    CONFIG_KEYS.GATEWAY_KEY_ID,
  );
  let key = row?.configValue?.trim() ?? '';

  if (!key.startsWith('rzp_')) {
    const res = await splashService.fetchAppConfig();
    if (res.status === SUCCESS && res.data?.length) {
      await ConfigRepository.saveAllConfigs(res.data);
      row = await ConfigRepository.getConfigByKeyFromDB(
        CONFIG_KEYS.GATEWAY_KEY_ID,
      );
      key = row?.configValue?.trim() ?? '';
    }
  }

  const validationError = validateRazorpayKeyId(key);
  if (validationError) {
    throw new Error(validationError);
  }
  return key;
}

export const paymentService = {
  async initiatePayment(options: PaymentOptions): Promise<PaymentResponse> {
    const razorKeyId = await resolveRazorpayKeyId();
    const contact = normalizeContactForRazorpay(options.phone);

    if (contact.length !== 10) {
      throw new Error(
        'A valid 10-digit mobile number is required for payment. Update your profile and try again.',
      );
    }

    const razorpayOptions = getPaymentOptions({
      amount: options.amount,
      orderId: options.orderId,
      email: options.email,
      phone: options.phone,
      userName: options.userName,
      description: options.description,
      razorKeyId,
    });

    if (__DEV__) {
      console.log('[Payment] Opening Razorpay', {
        amount: razorpayOptions.amount,
        hasOrderId: 'order_id' in razorpayOptions,
        keyPrefix: razorKeyId.slice(0, 12),
      });
    }

    try {
      const data = await RazorpayCheckout.open(razorpayOptions);
      return data as PaymentResponse;
    } catch (error: any) {
      const code = error?.code != null ? String(error.code) : 'UNKNOWN_ERROR';
      if (
        code === '0' ||
        code === '2' ||
        error?.description === 'Payment cancelled'
      ) {
        throw {
          code: 'CANCELLED',
          description: error?.description ?? 'User cancelled',
          message: 'Payment was cancelled.',
        };
      }
      throw {
        code,
        description: error?.description ?? error?.message ?? 'Payment failed',
        message: error?.description ?? 'Payment failed. Please try again.',
      };
    }
  },

  formatAmount(amount: number): string {
    return `${RUPEE_SIGN}${amount.toFixed(2)}`;
  },

  async getUserDetailsForPayment() {
    const user = sessionStore.getState().user;
    if (!user?.mobile?.trim()) {
      throw new Error(
        'Mobile number not found. Please log in again before checkout.',
      );
    }

    return {
      email: buildPaymentEmail(
        'anasm123@gmail.com',
        user.uid ?? 0,
        user.mobile,
      ),
      phone: user.mobile.trim(),
      userName: user.name?.trim() || 'Customer',
      userId: user.uid ?? 0,
    };
  },

  /** Refresh gateway key from server (call before first checkout if needed) */
  async ensureGatewayConfigured(): Promise<string | null> {
    try {
      await resolveRazorpayKeyId();
      return null;
    } catch (e) {
      return (e as Error).message;
    }
  },
};
