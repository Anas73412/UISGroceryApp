import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ProductModel } from '../data/models/ProductModel';
import type { AddressResponseModel } from '../data/models/AddressModel';
import type { OrderModel } from '../data/models/OrderModel';

export type RootStackParamList = {
  Splash: undefined;
  Permissions: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  ShareTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList> | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/** Params for `AddAddress` (used from Home stack and Settings stack). */
export type AddAddressRouteParams = {
  addressId?: number;
  address?: AddressResponseModel;
  /** With `longitude`, skips GPS and uses this pin for the form. */
  latitude?: number;
  longitude?: number;
  mapAddress?: string;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryScreen: undefined;
  SearchScreen: undefined;
  ProductScreen: { categoryId: number; categoryName: string };
  ProductDetailScreen: { product: ProductModel };
  HomeDeliveryAddress: undefined;
  AddAddress: AddAddressRouteParams;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
  DeliveryAddress: undefined;
  Order: undefined;
  OrderDetail: { order: OrderModel };
  OrderTracking: { order: OrderModel };
  MyProductRequest: undefined;
  NewProductRequest: undefined;
  AddAddress: AddAddressRouteParams;
};
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface AuthParamList extends AuthStackParamList {}
    interface MainParamList extends MainTabParamList {}
    interface HomeParamList extends HomeStackParamList {}
    interface SettingsParamList extends SettingsStackParamList {}
  }
}
