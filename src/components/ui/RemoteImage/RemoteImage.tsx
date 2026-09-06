import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageProps,
  StyleSheet,
  View,
} from 'react-native';
import { theme } from '../../../theme';

const IMAGE_LOAD_TIMEOUT = 10000;
const APP_ICON = require('../../../assets/images/app_icon.png');

type RemoteImageProps = Omit<ImageProps, 'source'> & {
  uri?: string;
  loaderSize?: 'small' | 'large';
  loaderColor?: string;
};

export function RemoteImage({
  uri,
  loaderSize = 'small',
  loaderColor = theme.colors.primary,
  style,
  onLoadStart,
  onLoad,
  onLoadEnd,
  onError,
  ...imageProps
}: RemoteImageProps) {
  const [isLoading, setIsLoading] = useState(!!uri);
  const [hasFailed, setHasFailed] = useState(!uri);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoadTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    clearLoadTimeout();
    setIsLoading(!!uri);
    setHasFailed(!uri);

    if (!uri) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setHasFailed(true);
      timeoutRef.current = null;
    }, IMAGE_LOAD_TIMEOUT);

    return clearLoadTimeout;
  }, [uri]);

  const handleLoadStart = () => {
    if (hasFailed) {
      onLoadStart?.();
      return;
    }
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoad = (
    event: Parameters<NonNullable<ImageProps['onLoad']>>[0],
  ) => {
    clearLoadTimeout();
    setIsLoading(false);
    onLoad?.(event);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    onLoadEnd?.();
  };

  const handleError = (
    event: Parameters<NonNullable<ImageProps['onError']>>[0],
  ) => {
    clearLoadTimeout();
    setIsLoading(false);
    setHasFailed(true);
    onError?.(event);
  };

  return (
    <View style={[styles.imageContainer, style]}>
      <Image
        {...imageProps}
        source={hasFailed ? APP_ICON : { uri }}
        style={hasFailed ? styles.fallbackImage : StyleSheet.absoluteFillObject}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size={loaderSize} color={loaderColor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackImage: {
    width: '60%',
    height: '60%',
  },
});
