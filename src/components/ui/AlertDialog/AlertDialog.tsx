import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { styles } from './AlertDialog.styles';

export type AlertType = 'error' | 'success';

export type AlertDialogProps = {
  visible: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  buttonText?: string;
};

export function AlertDialog({
  visible,
  onClose,
  type,
  title,
  message,
  buttonText = 'OK',
}: AlertDialogProps) {
  const isError = type === 'error';
  const titleStyle = isError ? styles.titleError : styles.titleSuccess;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
