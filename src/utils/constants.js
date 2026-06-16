import { Dimensions } from "react-native";

export const SUCCESS = 'Success';
export const FAILED = 'Failed';
export const SUB_PATH='/api/unitedweb';
export const SUB_ORDER_PATH='/api/Order';
export const IMAGE_BASE_URL='https://unitedinternetservice.in/';
export const RUPEE_SIGN='\u20B9';
export const UPLOAD_BASE_URL='https://unitedinternetservice.in/api/Fileuplodd';
export const BILL_URL='http://unitedinternetservice.in/bills/'
//API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${SUB_PATH}/login`,
  SIGNUP: '/signup',
  APP_CONFIG: `${SUB_PATH}/getAppConfig`,
  GET_SLIDERS: `${SUB_PATH}/getAllBanners`,
  GET_CATEGORIES: `${SUB_PATH}/getAllCategory`,
  GET_PRODUCTS: `${SUB_PATH}/getProductsWithPaging`,
  GET_CART_DETAILS: `${SUB_PATH}/getUserCartDetails`,
  ADD_TO_CART: `${SUB_PATH}/addToCart`,
  UPDATE_CART_QUANTITY: `${SUB_PATH}/updateCartQty`,
  REMOVE_CART_ITEM: `${SUB_PATH}/removeCartItem`,
  UPLOAD_PROFILE_PICTURE: `${UPLOAD_BASE_URL}/profilepic`,
  GET_USER_PROFILE: `${SUB_PATH}/userDetails`,
  UPDATE_PROFILE: `${SUB_PATH}/updateProfile`,
  USER_CART_LIST: `${SUB_PATH}/getCartProductList`,
  USER_ADDRESS_LIST: `${SUB_PATH}/getCustomerAddress`,
  ADD_CUSTOMER_ADDRESS: `${SUB_PATH}/addCustomerAddress`,
  UPDATE_CUSTOMER_ADDRESS: `${SUB_PATH}/updateCustomerAddress`,
  GET_DELIVERY_CHARGE: `${SUB_PATH}/getDeliveryCharges`,
  DELETE_CUSTOMER_ADDRESS: `${SUB_PATH}/deleteCustomerAddress`,
  GET_ALL_ORDERS: `${SUB_PATH}/getUserAllOrders`,
  GET_REQUETED_PRODUCT_LIST:`${SUB_ORDER_PATH}/getRequestedProductList`,
  NEW_PRODUCT_REQUEST:`${UPLOAD_BASE_URL}/addProductRequest`,
  SAVE_USER_ORDER: `${SUB_ORDER_PATH}/SaveOrder`,
  UPDATE_PAYMENT_STATUS: `${SUB_ORDER_PATH}/UpdatePaymentStatus`,
  GET_ALL_COMPLAINS: `${SUB_PATH}/getAllComplains`,
  ADD_COMPLAIN: `${SUB_PATH}/addComplain`,
  GET_CUSTOMER_BILLS: `${SUB_PATH}/getCustomerBills`,
};

export const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const SLIDER_PEEK = 24; // How much of next slide shows
export const SLIDER_ITEM_WIDTH = SCREEN_WIDTH - SLIDER_PEEK;
export const SLIDER_HEIGHT = 160;
export const AUTO_SLIDE_INTERVAL = 4000; 
export const EARTH_RADIUS_KM = 6371;
export const DATABASE_NAME = 'GroceryAppDB';
export const DEFAULT_DELIVERY_CHARGE = 40;
export const DEFAULT_DELIVERY_TIME = '10';

export const DB_TABLES ={
  USER_TABLE: 'users',
  CONFIG_TABLE: 'app_config',
  CART_TABLE:'cart',
  ADDRESS_TABLE:'address',
  DELIVERY_CHARGE_TABLE:'delivery_charge',
};

export const CONFIG_KEYS = {
  SMALL_CART_MIN_AMOUNT:'SMALL_CART_MIN_AMOUNT',
  ALLOW_PINCODES:'ALLOW_PINCODES',
  DEFAULT_LATITUDE:'DEFAULT_LATITUDE',
  DEFAULT_LONGITUDE:'DEFAULT_LONGITUDE',
  RECEIPT_FOOTER_MESSAGE:'RECEIPT_FOOTER_MESSAGE',
  GATEWAY_KEY_ID:'GATEWAY_KEY_ID',
  GATEWAY_SECRET_KEY:'GATEWAY_SECRET_KEY',
  REFER_URL:'REFER_URL',
  REFER_MESSAGE:'REFER_MESSAGE',
  ORDER_HELP_ENABLE_TIME:'ORDER_HELP_ENABLE_TIME',
  ADD_COMPLAIN_ENABLE:'ADD_COMPLAIN_ENABLE',
  VIEW_COMPLAIN_ENABLE:'VIEW_COMPLAIN_ENABLE',
  EXPORT_LOG_FILE_ENABLE:'EXPORT_LOG_FILE_ENABLE',
  SMALL_CART_AMOUNT:'SMALL_CART_AMOUNT',
};

export const SERVICE_AUTH_CREDENTIALS = 'com.united.uis';
export const APP_UIS_PREFS = 'com.united.uis.prefs';



export const ORDER_TRACKING_PATH = `${SUB_ORDER_PATH}/getOrderTracking`;