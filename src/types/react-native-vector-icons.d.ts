declare module 'react-native-vector-icons/MaterialIcons' {
  import type { ComponentType } from 'react';
  import type { TextProps } from 'react-native';

  type MaterialIconsProps = TextProps & {
    name: string;
    size?: number;
    color?: string;
  };

  const MaterialIcons: ComponentType<MaterialIconsProps>;

  export default MaterialIcons;
}
