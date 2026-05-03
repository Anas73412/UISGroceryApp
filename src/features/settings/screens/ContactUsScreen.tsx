import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../theme';
import { Input, Button } from '../../../components/ui';
import type { SettingsStackParamList } from '../../../navigation/types';
import Toast from 'react-native-toast-message';

const SUPPORT_PHONE = '1-800-FRESH';
const SUPPORT_PHONE_TEL = 'tel:+180037374';
const SUPPORT_EMAIL = 'help@freshcart.com';
const OFFICE_ADDRESS_LINE_1 = '123 Fresh Way, Suite 400';
const OFFICE_ADDRESS_LINE_2 = 'New York, NY 10001';

type Nav = NativeStackNavigationProp<SettingsStackParamList, 'ContactUs'>;

export function ContactUsScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const openDial = () => {
    Linking.openURL(SUPPORT_PHONE_TEL).catch(() => {
      Toast.show({ type: 'error', text1: 'Could not start the phone app.' });
    });
  };

  const openMail = (body?: string) => {
    const subject = 'GroceryApp — Contact from app';
    const parts = [`subject=${encodeURIComponent(subject)}`];
    if (body?.trim()) {
      parts.push(`body=${encodeURIComponent(body.trim())}`);
    }
    const url = `mailto:${SUPPORT_EMAIL}?${parts.join('&')}`;
    Linking.openURL(url).catch(() => {
      Toast.show({ type: 'error', text1: 'Could not open the mail app.' });
    });
  };

  const onSend = () => {
    if (message.trim().length < 5) {
      Toast.show({
        type: 'info',
        text1: 'Add a few words in your message',
      });
      return;
    }
    const body = [
      name.trim() && `Name: ${name.trim()}`,
      email.trim() && `Email: ${email.trim()}`,
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n\n');
    openMail(body);
    Toast.show({ type: 'success', text1: 'Opening your email app…' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton} hitSlop={12}>
          <MaterialIcons name="menu" size={24} color={theme.colors.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>FreshCart</Text>
        <View style={styles.avatarWrap}>
          <MaterialIcons name="person" size={18} color={theme.colors.gray700} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.screenTitle}>Get in touch</Text>
        <Text style={styles.screenSubtitle}>
          We're here to help you with your grocery needs and any questions you might
          have.
        </Text>

        <View style={styles.contactCardsRow}>
          <Pressable
            style={({ pressed }) => [styles.contactCard, { opacity: pressed ? 0.85 : 1 }]}
            onPress={openDial}
          >
            <View style={styles.contactCardIcon}>
              <MaterialIcons name="call" size={22} color={theme.colors.secondary} />
            </View>
            <Text style={styles.contactCardLabel}>Hotline</Text>
            <Text style={styles.contactCardValue}>{SUPPORT_PHONE}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.contactCard, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => openMail()}
          >
            <View style={styles.contactCardIcon}>
              <MaterialIcons name="email" size={22} color={theme.colors.secondary} />
            </View>
            <Text style={styles.contactCardLabel}>Email</Text>
            <Text style={styles.contactCardValue}>{SUPPORT_EMAIL}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Send us a message</Text>

          <Input
            label="NAME"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
          />
          <Input
            label="EMAIL ADDRESS"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="john@example.com"
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
          />
          <Input
            label="MESSAGE"
            value={message}
            onChangeText={setMessage}
            placeholder="How can we help you today?"
            multiline
            numberOfLines={4}
            containerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
            inputStyle={Platform.select({
              android: { minHeight: 96, textAlignVertical: 'top' as const },
              default: { minHeight: 96 },
            })}
          />
          <Button
            title="Send Message"
            onPress={onSend}
            containerStyle={styles.sendButton}
            textStyle={styles.sendButtonText}
          />
        </View>

        <View style={styles.officeCard}>
          <View style={styles.mapCard}>
            <MaterialIcons name="map" size={44} color="#7f8892" />
            <View style={styles.mapPin}>
              <MaterialIcons name="place" size={16} color={theme.colors.white} />
            </View>
          </View>
          <View style={styles.officeInfoRow}>
            <MaterialIcons name="location-on" size={18} color={theme.colors.secondary} />
            <View style={styles.officeTextWrap}>
              <Text style={styles.officeTitle}>Main Office</Text>
              <Text style={styles.officeAddress}>
                {OFFICE_ADDRESS_LINE_1}
                {'\n'}
                {OFFICE_ADDRESS_LINE_2}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.socialLabel}>FOLLOW OUR JOURNEY</Text>
          <View style={styles.socialRow}>
            <Pressable style={styles.socialIconButton}>
              <MaterialIcons name="public" size={20} color={theme.colors.secondary} />
            </Pressable>
            <Pressable style={styles.socialIconButton}>
              <MaterialIcons name="share" size={20} color={theme.colors.secondary} />
            </Pressable>
            <Pressable style={styles.socialIconButton}>
              <MaterialIcons name="smart-display" size={20} color={theme.colors.secondary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f5',
  },
  header: {
    height: 74,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.borderLight,
    paddingHorizontal: theme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.gray300,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1f1f1f',
    marginBottom: theme.spacing[1],
  },
  screenSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray700,
    lineHeight: 22,
    marginBottom: theme.spacing[4],
  },
  contactCardsRow: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3],
  },
  contactCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  contactCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(57, 175, 188, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  contactCardLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: '#1f1f1f',
    marginBottom: 2,
  },
  contactCardValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f1f1f',
    marginBottom: theme.spacing[2],
  },
  inputContainer: {
    marginBottom: theme.spacing[2],
  },
  inputLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: '#121212',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  sendButton: {
    marginTop: theme.spacing[1],
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  sendButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '500',
  },
  officeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: theme.spacing[3],
  },
  mapCard: {
    height: 170,
    backgroundColor: '#9fa5ad',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  officeInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    gap: theme.spacing[2],
  },
  officeTextWrap: {
    flex: 1,
  },
  officeTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: '700',
    color: '#1f1f1f',
  },
  officeAddress: {
    marginTop: 2,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray600,
    lineHeight: 20,
  },
  socialSection: {
    alignItems: 'center',
    marginTop: theme.spacing[1],
  },
  socialLabel: {
    fontSize: 11,
    color: '#2f2f2f',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: theme.spacing[2],
  },
  socialRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  socialIconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
