import { Dimensions } from "react-native";

export const SUCCESS = 'Success';
export const FAILED = 'Failed';
export const SUB_PATH='/api/unitedweb';
export const IMAGE_BASE_URL='https://unitedinternetservice.in/';

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
};

export const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const SLIDER_PEEK = 24; // How much of next slide shows
export const SLIDER_ITEM_WIDTH = SCREEN_WIDTH - SLIDER_PEEK;
export const SLIDER_HEIGHT = 160;
export const AUTO_SLIDE_INTERVAL = 4000; 

export const DATABASE_NAME = 'GroceryAppDB';

export const DB_TABLES ={
  USER_TABLE: 'users',
  CONFIG_TABLE: 'app_config',
  CART_TABLE:'cart'
};

export const CONFIG_KEYS = {
  SMALL_CART_MIN_AMOUNT:'SMALL_CART_MIN_AMOUNT',
  ALLOW_PINCODES:'ALLOW_PINCODES',
  DEFAULT_LATITUDE:'DEFAULT_LATITUDE',
  DEFAULT_LONGITUDE:'DEFAULT_LONGITUDE',
  RECEIPT_FOOTER_MESSAGE:'RECEIPT_FOOTER_MESSAGE',
  GATEWAY_SECRET_KEY:'GATEWAY_SECRET_KEY',
  REFER_URL:'REFER_URL',
  REFER_MESSAGE:'REFER_MESSAGE',
  ORDER_HELP_ENABLE_TIME:'ORDER_HELP_ENABLE_TIME',
  ADD_COMPLAIN_ENABLE:'ADD_COMPLAIN_ENABLE',
  VIEW_COMPLAIN_ENABLE:'VIEW_COMPLAIN_ENABLE',
  EXPORT_LOG_FILE_ENABLE:'EXPORT_LOG_FILE_ENABLE',
};

export const SERVICE_AUTH_CREDENTIALS = 'com.united.uis';