import React from 'react';
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { theme } from '../../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export type ButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  title,
  variant = 'primary',
  disabled = false,
  containerStyle,
  textStyle,
  style,
  ...rest
}: ButtonProps) {
  const { primary, secondary } = theme.colors;

  const baseContainer: ViewStyle = {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  };

  let variantContainer: ViewStyle = {};
  let variantText: TextStyle = {};

  switch (variant) {
    case 'secondary':
      variantContainer = { backgroundColor: secondary };
      variantText = { color: '#ffffff' };
      break;
    case 'outline':
      variantContainer = {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: primary,
      };
      variantText = { color: primary };
      break;
    case 'primary':
    default:
      variantContainer = { backgroundColor: primary };
      variantText = { color: '#ffffff' };
      break;
  }

  const disabledStyle: ViewStyle | undefined = disabled ? { opacity: 0.5 } : undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        baseContainer,
        variantContainer,
        disabledStyle,
        containerStyle,
        style as ViewStyle,
      ]}
      {...rest}
    >
      <Text
        style={[
          {
            fontWeight: '700',
            fontSize: 16,
          },
          variantText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}