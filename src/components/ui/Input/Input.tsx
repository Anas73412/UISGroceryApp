import React from 'react';
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { appTheme } from '../../../theme';
import { styles } from './Input.styles';

const { primary } = appTheme;

export type InputProps = TextInputProps & {
  label?: string;
  labelStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
};

export function Input({
  label,
  labelStyle,
  leftIcon,
  rightElement,
  containerStyle,
  inputStyle,
  error,
  placeholderTextColor = '#9ca3af',
  style,
  ...rest
}: InputProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <View style={[styles.row, error ? styles.rowError : undefined]}>
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, leftIcon && styles.inputWithLeftIcon, inputStyle, style]}
          {...rest}
        />
        {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
