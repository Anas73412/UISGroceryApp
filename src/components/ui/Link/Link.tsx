import React from 'react';
import { Pressable, Text, type PressableProps, type TextStyle } from 'react-native';
import { styles } from './Link.styles';

export type LinkProps = PressableProps & {
  children: string;
  textStyle?: TextStyle;
};

export function Link({ children, textStyle, ...rest }: LinkProps) {
  return (
    <Pressable hitSlop={12} {...rest}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
}
