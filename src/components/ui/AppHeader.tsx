import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  useNavigation,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { cartStore } from '../../store/cartStore';
import { theme } from '../../theme';

type AppHeaderProps = {
  title: string;
  onBackPress?: () => void;
  showCartIcon?: boolean;
  onCartPress?: () => void;
  /** When set, overrides default title color. */
  titleColor?: string;
  showNotificationIcon?: boolean;
  onNotificationPress?: () => void;
  showNewsButton?: boolean;
  onNewsPress?: () => void;
};

export function AppHeader({
  title,
  onBackPress,
  showCartIcon = true,
  onCartPress,
  titleColor,
  showNotificationIcon = false,
  onNotificationPress,
  showNewsButton = false,
  onNewsPress,
}: AppHeaderProps) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const cartCount = cartStore(s =>
    s.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
  );

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
      return;
    }

    navigation.navigate('CartTab' as never);
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const resolvedTitleColor = titleColor ?? theme.colors.gray800;

  return (
    <View style={styles.header}>
      <Pressable
        onPress={handleBackPress}
        style={styles.backButton}
        hitSlop={12}
      >
        <MaterialIcons
          name="chevron-left"
          size={28}
          color={resolvedTitleColor}
        />
      </Pressable>

      <Text
        style={[styles.headerTitle, { color: resolvedTitleColor }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {showNotificationIcon ? (
        <Pressable
          onPress={handleNotificationPress}
          style={styles.cartIconWrap}
          hitSlop={12}
        >
          <MaterialIcons
            name="notifications-none"
            size={24}
            color={theme.colors.gray800}
          />
        </Pressable>
      ) : (
        <View style={styles.headerRight}>
          {showNewsButton ? (
            <Pressable
              onPress={onNewsPress}
              style={styles.newsButton}
              hitSlop={8}
            >
              <Text style={styles.newsButtonText}>News</Text>
            </Pressable>
          ) : null}
          {showCartIcon ? (
            <Pressable
              onPress={handleCartPress}
              style={styles.cartIconWrap}
              hitSlop={12}
            >
              <MaterialIcons
                name="shopping-cart"
                size={24}
                color={theme.colors.primary}
              />
              {cartCount > 0 && (
                <View style={styles.headerCartBadge}>
                  <Text style={styles.headerCartBadgeText}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              )}
            </Pressable>
          ) : !showNewsButton ? (
            <View style={styles.rightSpacer} />
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    paddingTop: theme.spacing[5],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -theme.spacing[1],
    backgroundColor: theme.colors.gray100,
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: theme.spacing[2],
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.gray800,
    textAlign: 'center',
  },
  cartIconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSpacer: {
    width: 40,
    height: 40,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  newsButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[3],
    minHeight: 32,
    justifyContent: 'center',
  },
  newsButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textOnPrimary,
  },
  headerCartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  headerCartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.white,
  },
});
