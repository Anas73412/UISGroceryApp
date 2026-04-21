import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ProductModel } from '../data/models/ProductModel';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ShareTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  CategoryScreen: undefined;
  SearchScreen: undefined;
  ProductScreen: { categoryId: number; categoryName: string };
  ProductDetailScreen: { product: ProductModel };
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
  }
}
