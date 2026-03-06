import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { theme } from '../../../theme';
import { styles } from './ConfirmDialog.styles';
import { Button } from '../Button';

export type ConfirmationVariant = 'primary' | 'danger' | 'warning' | 'info';

export type ConfirmDialogIcon =
  | 'question-circle'
  | 'exclamation-triangle'
  | 'info-circle'
  | 'trash-alt';

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmationVariant;
  icon?: ConfirmDialogIcon;
  onConfirm: () => void;
  onCancel: () => void;
};

const variantConfig: Record<
  ConfirmationVariant,
  {
    iconColor: string;
    iconBg: string;
    titleColor: string;
    confirmButtonVariant: 'primary' | 'secondary' | 'outline';
    confirmButtonStyle?: { backgroundColor: string };
    backgroundColor: string;
  }
> = {
  primary: {
    iconColor: theme.colors.primary,
    iconBg: '#E0F7FA',
    titleColor: theme.colors.primary,
    confirmButtonVariant: 'primary',
    backgroundColor: '#FFFFFF',
  },
  danger: {
    iconColor: theme.colors.error,
    iconBg: '#FEE2E2',
    titleColor: theme.colors.error,
    confirmButtonVariant: 'primary',
    confirmButtonStyle: { backgroundColor: theme.colors.error },
    backgroundColor: '#FEF2F2',
  },
  warning: {
    iconColor: theme.colors.warning,
    iconBg: '#FEF3C7',
    titleColor: theme.colors.warning,
    confirmButtonVariant: 'primary',
    confirmButtonStyle: { backgroundColor: theme.colors.warning },
    backgroundColor: '#FFFBEB',
  },
  info: {
    iconColor: theme.colors.secondary,
    iconBg: '#E0F2F1',
    titleColor: theme.colors.secondary,
    confirmButtonVariant: 'primary',
    backgroundColor: '#F0FDFA',
  },
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  icon = 'question-circle',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable
          style={[styles.card, { backgroundColor: config.backgroundColor }]}
          onPress={e => e.stopPropagation()}
          accessibilityRole="alert"
          accessibilityLabel={`${title}. ${message}`}
        >
          <View style={[styles.iconCircle, { backgroundColor: config.iconBg }]}>
            <Icon
              name={icon}
              size={36}
              color={config.iconColor}
              style={styles.icon}
            />
          </View>

          <Text style={[styles.title, { color: config.titleColor }]}>
            {title}
          </Text>
          <Text style={styles.message} numberOfLines={6}>
            {message}
          </Text>

          <View style={styles.actions}>
            <Button
              title={cancelLabel}
              variant="outline"
              onPress={handleCancel}
              style={styles.buttonCancel}
            />
            <Button
              title={confirmLabel}
              variant={config.confirmButtonVariant}
              onPress={handleConfirm}
              style={[styles.buttonConfirm, config.confirmButtonStyle]}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
