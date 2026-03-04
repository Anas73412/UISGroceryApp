import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { theme } from '../../../theme';
import styles from './style';
import { Button } from '../Button';

export type MessageDialogType = 'success' | 'error';

export interface MessageDialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: MessageDialogType;
  onClose: () => void;
  buttonText?: string;
}

const config = {
  error: {
    icon: '✕',
    iconColor: theme.colors.error,
    titleColor: theme.colors.error,
    buttonVariant: 'secondary' as const,
    backgroundColor: '#FEF2F2',
    iconBg: '#FEE2E2',
  },
  success: {
    icon: '✓',
    iconColor: theme.colors.success,
    titleColor: theme.colors.success,
    buttonVariant: 'primary' as const,
    backgroundColor: '#F0FDF4',
    iconBg: '#DCFCE7',
  },
};

export function MessageDialog({
  visible,
  title,
  message,
  type = 'success',
  onClose,
  buttonText = 'OK',
}: MessageDialogProps) {
  const styleConfig = config[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.card, { backgroundColor: styleConfig.backgroundColor }]} onPress={(e) => e.stopPropagation()} accessibilityRole="alert" accessibilityLabel={`${type}: ${title}. ${message}`}>
          <View style={[styles.iconCircle, { backgroundColor: styleConfig.iconBg }]}>
            <Text style={[styles.iconText, { color: styleConfig.iconColor }]}>{styleConfig.icon}</Text>
          </View>

          <Text style={[styles.title, { color: styleConfig.titleColor }]}>{title}</Text>
          <Text style={styles.message} numberOfLines={6}>{message}</Text>

          <Button
            title={buttonText}
            variant={styleConfig.buttonVariant}
            onPress={onClose}
            style={styles.button}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default MessageDialog;