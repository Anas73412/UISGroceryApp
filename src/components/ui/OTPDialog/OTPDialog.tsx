import React, { useState, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { styles } from './OTPDialog.styles';

const DIGIT_COUNT = 6;

export type OTPDialogProps = {
  visible: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  title?: string;
  subtitle?: string;
};

export function OTPDialog({
  visible,
  onClose,
  onVerify,
  title = 'Enter OTP',
  subtitle = 'We sent a code to your mobile number',
}: OTPDialogProps) {
  const [digits, setDigits] = useState<string[]>(Array(DIGIT_COUNT).fill(''));
  const refs = useRef<(TextInput | null)[]>([]);

  const setDigit = useCallback((index: number, value: string) => {
    const v = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
    if (v && index < DIGIT_COUNT - 1) {
      refs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyPress = useCallback(
    (index: number) => (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  const otpValue = digits.join('');
  const canVerify = otpValue.length === DIGIT_COUNT;

  const handleVerify = () => {
    if (canVerify) {
      onVerify(otpValue);
      onClose();
      setDigits(Array(DIGIT_COUNT).fill(''));
    }
  };

  const handleClose = () => {
    onClose();
    setDigits(Array(DIGIT_COUNT).fill(''));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <View style={styles.row}>
            {Array.from({ length: DIGIT_COUNT }, (_, i) => (
              <TextInput
                key={i}
                ref={(r) => { refs.current[i] = r; }}
                style={[
                  styles.digitInput,
                  digits[i] ? styles.digitInputFilled : undefined,
                ]}
                value={digits[i]}
                onChangeText={(v) => setDigit(i, v)}
                onKeyPress={handleKeyPress(i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          <View style={styles.actions}>
            <Pressable style={styles.buttonCancel} onPress={handleClose}>
              <Text style={styles.buttonCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonVerify, !canVerify && { opacity: 0.5 }]}
              onPress={handleVerify}
              disabled={!canVerify}
            >
              <Text style={styles.buttonVerifyText}>Verify</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
