import React, { useCallback, useState } from 'react';
import { RefreshControl, type RefreshControlProps } from 'react-native';
import { theme } from '../../../theme';

export type PullToRefreshProps = Omit<
  RefreshControlProps,
  'refreshing' | 'onRefresh' | 'tintColor' | 'colors'
> & {
  refreshing: boolean;
  onRefresh: () => void;
};

/** Shared RefreshControl styled for the app. Use with FlatList/ScrollView. */
export function PullToRefresh({
  refreshing,
  onRefresh,
  ...rest
}: PullToRefreshProps) {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={theme.colors.primary}
      colors={[theme.colors.primary]}
      progressBackgroundColor={theme.colors.white}
      {...rest}
    />
  );
}

type RefreshHandler = () => void | Promise<void>;

/**
 * Manages pull-to-refresh state and returns a ready-to-use RefreshControl.
 * Pass the page's reload API (without the global full-screen loader).
 */
export function usePullToRefresh(onRefreshData: RefreshHandler) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (refreshing) {
      return;
    }
    setRefreshing(true);
    try {
      await onRefreshData();
    } finally {
      setRefreshing(false);
    }
  }, [onRefreshData, refreshing]);

  const refreshControl = (
    <PullToRefresh refreshing={refreshing} onRefresh={onRefresh} />
  );

  return { refreshing, onRefresh, refreshControl };
}
