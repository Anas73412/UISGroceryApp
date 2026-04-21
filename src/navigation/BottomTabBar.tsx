import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { theme } from '../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { cartStore } from '../store/cartStore';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const TAB_ICONS: Record<string, string> = {
  HomeTab: 'home',
  ShareTab: 'share',
  CartTab: 'shopping-bag',
  ProfileTab: 'person',
  SettingsTab: 'settings',
};

const TAB_LABELS: Record<string, string> = {
  HomeTab: 'Home',
  ShareTab: 'Share',
  CartTab: 'Cart',
  ProfileTab: 'Profile',
  SettingsTab: 'Setting',
};
const HIDE_TAB_BAR_ROUTES = ['ProductScreen', 'ProductDetailScreen'];

export function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const cartCount = cartStore(s => s.items.length);
  const route = state.routes[state.index];
  const routeName = getFocusedRouteNameFromRoute({
    params: route.params,
    name: route.name,
  });
  const currentRoute = route.state?.routes?.[route.state?.index ?? 1];
  const focusedRouteName = currentRoute?.name ?? routeName;

  const shouldHide = HIDE_TAB_BAR_ROUTES.includes(focusedRouteName ?? 'Home');

  if (shouldHide) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isCenter = route.name === 'CartTab';
          const icon = TAB_ICONS[route.name] ?? 'circle';
          const label = TAB_LABELS[route.name] ?? route.name;

          if (isCenter) {
            return (
              <View key={route.key} style={styles.centerSlot}>
                <View style={styles.badgeContainer}>
                  <Pressable
                    style={[
                      styles.centerButton,
                      isFocused && styles.centerButtonFocused,
                    ]}
                    onPress={onPress}
                  >
                    <MaterialIcons
                      name={icon as never}
                      size={28}
                      color={theme.colors.textOnPrimary}
                    />
                    {cartCount > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {cartCount > 99 ? '99+' : cartCount}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            );
          }

          return (
            <Pressable key={route.key} style={styles.tab} onPress={onPress}>
              <MaterialIcons
                name={icon as never}
                size={24}
                color={isFocused ? theme.colors.primary : theme.colors.gray400}
                style={styles.tabIcon}
              />
              <Text style={[styles.label, isFocused && styles.labelFocused]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: theme.spacing[3],
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginBottom: 2,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
  },
  labelFocused: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  centerSlot: {
    width: 72,
    alignItems: 'center',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
    shadowColor: theme.colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  centerButtonFocused: {
    backgroundColor: theme.colors.primaryDark,
  },
  badgeContainer: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 9,
    backgroundColor: theme.colors.error, // or a contrasting color
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
