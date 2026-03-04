import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { theme } from '../../../theme';

export type GlobalLoaderProps = {
  visible: boolean;
  textContent?: string;
};

export function GlobalLoader({ visible, textContent = '' }: GlobalLoaderProps) {
  return (
    <Spinner
      visible={visible}
      textContent={textContent}
      textStyle={spinnerTextStyle}
      color={theme.colors.primary}
      overlayColor="rgba(0, 0, 0, 0.4)"
      animation="fade"
      size="large"
      cancelable={false}
    />
  );
}

const spinnerTextStyle = {
  color: '#fff',
  fontSize: 16,
  marginTop: 12,
};
