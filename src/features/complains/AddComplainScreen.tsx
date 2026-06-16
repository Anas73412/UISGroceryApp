import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import { AppHeader } from '../../components/ui';
import { theme } from '../../theme';
import type { SettingsStackParamList } from '../../navigation/types';
import { useLoading } from '../../components/context/LoadingContext';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import { SUCCESS } from '../../utils/constants';
import { complainController } from './controller';
import styles from './AddComplainScreen.Style';

const PROBLEM_TYPE_OPTIONS = [
  'Connection Not Working',
  'Broken Wire',
  'Red Light Blinking',
  'Router Not Working',
  'Speed Issue',
  'Other',
] as const;

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'AddComplain'>;

type FormErrors = {
  problem?: string;
  problemType?: string;
  description?: string;
};

export function AddComplainScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { show, hide } = useLoading();
  const { showErrorDialog } = useMessageDialog();

  const [problem, setProblem] = useState('');
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!problem.trim()) {
      next.problem = 'Problem is required';
    }
    if (!problemType.trim()) {
      next.problemType = 'Please select a problem type';
    }
    if (!description.trim()) {
      next.description = 'Description is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    show('Submitting complaint...');
    try {
      const res = await complainController.submitComplain({
        problem: problem.trim(),
        problem_type: problemType.trim(),
        description: description.trim(),
      });

      if (res.status === SUCCESS) {
        Toast.show({
          type: 'success',
          text1: res.message || 'Complaint submitted successfully',
        });
        navigation.goBack();
        return;
      }

      showErrorDialog(
        'Submission failed',
        res.message || 'Could not submit your complaint.',
      );
    } catch {
      showErrorDialog(
        'Submission failed',
        'Could not submit your complaint. Please try again.',
      );
    } finally {
      hide();
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Add Complaint" showCartIcon={false} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.infoCard}>
            <View style={styles.infoIconWrap}>
              <MaterialIcons
                name="headset-mic"
                size={24}
                color={theme.colors.white}
              />
            </View>
            <Text style={styles.infoTitle}>Need help?</Text>
            <Text style={styles.infoText}>
              Please provide details about your issue. Our support team
              typically responds within 24 hours to resolve your concerns.
            </Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Problem</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Briefly state the problem"
              placeholderTextColor={theme.colors.gray500}
              value={problem}
              onChangeText={text => {
                setProblem(text);
                if (errors.problem) {
                  setErrors(prev => ({ ...prev, problem: undefined }));
                }
              }}
            />
            {errors.problem ? (
              <Text style={styles.fieldError}>{errors.problem}</Text>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Problem Type</Text>
            <Pressable
              style={styles.selectInput}
              onPress={() => setTypePickerOpen(true)}
            >
              <Text
                style={[
                  styles.selectText,
                  !problemType && styles.selectPlaceholder,
                ]}
                numberOfLines={1}
              >
                {problemType || 'Select an issue category'}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color={theme.colors.gray500}
              />
            </Pressable>
            {errors.problemType ? (
              <Text style={styles.fieldError}>{errors.problemType}</Text>
            ) : null}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your issue in detail..."
              placeholderTextColor={theme.colors.gray500}
              value={description}
              onChangeText={text => {
                setDescription(text);
                if (errors.description) {
                  setErrors(prev => ({ ...prev, description: undefined }));
                }
              }}
              multiline
              numberOfLines={5}
            />
            {errors.description ? (
              <Text style={styles.fieldError}>{errors.description}</Text>
            ) : null}
          </View>

          <View style={styles.promoBanner}>
            <View style={styles.promoBannerOverlay} />
            <View style={styles.promoTopRow}>
              <View style={styles.promoIconCircle}>
                <MaterialIcons
                  name="support-agent"
                  size={40}
                  color={theme.colors.white}
                />
              </View>
              <View style={styles.promoBadge}>
                <MaterialIcons
                  name="badge"
                  size={32}
                  color="rgba(255,255,255,0.85)"
                />
              </View>
            </View>
            <Text style={styles.promoTitle}>We&apos;re here to help you</Text>
            <Text style={styles.promoSubtitle}>
              Your satisfaction is our priority at GroceryApp.
            </Text>
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit complaint"
          >
            <View style={styles.submitButtonInner}>
              <MaterialIcons name="send" size={20} color={theme.colors.white} />
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={typePickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setTypePickerOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setTypePickerOpen(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => undefined}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Problem Type</Text>
            <FlatList
              data={PROBLEM_TYPE_OPTIONS}
              keyExtractor={item => item}
              renderItem={({ item }) => {
                const selected = item === problemType;
                return (
                  <Pressable
                    style={[
                      styles.modalOption,
                      selected && styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setProblemType(item);
                      setTypePickerOpen(false);
                      if (errors.problemType) {
                        setErrors(prev => ({
                          ...prev,
                          problemType: undefined,
                        }));
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        selected && styles.modalOptionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
