import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../theme';
import { AppHeader } from '../../../components/ui';
import Toast from 'react-native-toast-message';
import { settingsService, type ContactApiItem } from '../service';

type ContactKind = 'phone' | 'email';

type ContactCardItem = {
  id: string;
  kind: ContactKind;
  label: string;
  value: string;
  icon: 'call' | 'email';
};

type ContactVisualConfig = {
  cardBackground: string;
  accentBackground: string;
  iconBackground: string;
  iconColor: string;
  actionLabel: string;
  actionHelperText: string;
  actionChipBackground: string;
  actionChipTextColor: string;
};

const EMAIL_REGEX = /\S+@\S+\.\S+/i;
const PHONE_REGEX = /[+\d][\d\s-]{5,}/;

const sanitizePhoneNumber = (value: string) => value.replace(/[^\d+]/g, '');

const getContactVisualConfig = (kind: ContactKind): ContactVisualConfig => {
  if (kind === 'phone') {
    return {
      cardBackground: '#EAF9FB',
      accentBackground: '#CFEFF4',
      iconBackground: '#39afbc',
      iconColor: theme.colors.white,
      actionLabel: 'Call now',
      actionHelperText: 'Opens your phone app',
      actionChipBackground: '#39afbc',
      actionChipTextColor: theme.colors.white,
    };
  }

  return {
    cardBackground: '#F3EEFF',
    accentBackground: '#E3D8FF',
    iconBackground: '#7C5CE5',
    iconColor: theme.colors.white,
    actionLabel: 'Send email',
    actionHelperText: 'Opens your mail app',
    actionChipBackground: '#7C5CE5',
    actionChipTextColor: theme.colors.white,
  };
};

const getContactKind = (item: ContactApiItem): ContactKind | null => {
  const description = item.description?.trim() ?? '';
  const combinedText = `${item.title} ${description}`.toLowerCase();

  if (EMAIL_REGEX.test(description) || combinedText.includes('email')) {
    return 'email';
  }

  if (
    PHONE_REGEX.test(description) ||
    combinedText.includes('phone') ||
    combinedText.includes('call') ||
    combinedText.includes('contact')
  ) {
    return 'phone';
  }

  return null;
};

const mapToContactCard = (item: ContactApiItem): ContactCardItem | null => {
  const kind = getContactKind(item);
  const value = item.description?.trim();

  if (!kind || !value) {
    return null;
  }

  return {
    id: `${kind}-${item.pageId}`,
    kind,
    label: kind === 'phone' ? 'Phone number' : 'Email address',
    value,
    icon: kind === 'phone' ? 'call' : 'email',
  };
};

export function ContactUsScreen() {
  const [contactItems, setContactItems] = useState<ContactCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadContactDetails = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    const response = await settingsService.fetchContactDetails();
    if (!response.data) {
      setContactItems([]);
      setErrorMessage(response.message || 'Could not load contact details.');
      setIsLoading(false);
      return;
    }

    const mappedItems = [response.data]
      .map(mapToContactCard)
      .filter((item): item is ContactCardItem => item !== null);

    const nextItems = [
      mappedItems.find(item => item.kind === 'phone'),
      mappedItems.find(item => item.kind === 'email'),
    ].filter((item): item is ContactCardItem => item !== undefined);

    setContactItems(nextItems);
    setErrorMessage(
      nextItems.length === 0
        ? 'No contact details are available right now.'
        : '',
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadContactDetails();
  }, [loadContactDetails]);

  const openPhone = (phoneNumber: string) => {
    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);

    if (!sanitizedPhoneNumber) {
      Toast.show({ type: 'error', text1: 'Phone number is not available.' });
      return;
    }

    Linking.openURL(`tel:${sanitizedPhoneNumber}`).catch(() => {
      Toast.show({ type: 'error', text1: 'Could not start the phone app.' });
    });
  };

  const openMail = (emailAddress: string) => {
    if (!emailAddress.trim()) {
      Toast.show({ type: 'error', text1: 'Email address is not available.' });
      return;
    }

    Linking.openURL(`mailto:${emailAddress.trim()}`).catch(() => {
      Toast.show({ type: 'error', text1: 'Could not open the mail app.' });
    });
  };

  const handleContactPress = (item: ContactCardItem) => {
    if (item.kind === 'phone') {
      openPhone(item.value);
      return;
    }

    openMail(item.value);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Contact Us" showCartIcon={false} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <MaterialIcons
              name="support-agent"
              size={34}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.screenTitle}>Get in touch</Text>
          <Text style={styles.screenSubtitle}>
            Need help or have a question? Our contact details are provided
            through the app. Tap the phone number to call us directly or tap the
            email address to send us a message. Our support team is here to
            assist you.
          </Text>
        </View>

        <View style={styles.listCard}>
          {isLoading ? (
            <View style={styles.feedbackState}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={styles.feedbackText}>
                Loading contact details...
              </Text>
            </View>
          ) : null}

          {!isLoading && errorMessage ? (
            <View style={styles.feedbackState}>
              <MaterialIcons
                name="error-outline"
                size={22}
                color={theme.colors.warning}
              />
              <Text style={styles.feedbackText}>{errorMessage}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.retryButtonPressed,
                ]}
                onPress={loadContactDetails}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : null}

          {!isLoading &&
            !errorMessage &&
            contactItems.map((item, index) => {
              const visualConfig = getContactVisualConfig(item.kind);

              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.contactCard,
                    index > 0 && styles.contactCardSpacing,
                    { backgroundColor: visualConfig.cardBackground },
                    pressed && styles.contactCardPressed,
                  ]}
                  onPress={() => handleContactPress(item)}
                >
                  {/* <View
                    style={[
                      styles.contactCardAccent,
                      {
                        backgroundColor: visualConfig.accentBackground,
                      },
                    ]}
                  /> */}

                  <View style={styles.contactCardHeader}>
                    <View
                      style={[
                        styles.contactIconWrap,
                        {
                          backgroundColor: visualConfig.iconBackground,
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={24}
                        color={visualConfig.iconColor}
                      />
                    </View>

                    <View style={styles.contactTextWrap}>
                      <Text style={styles.contactLabel}>{item.label}</Text>
                      <Text style={styles.contactValue}>{item.value}</Text>
                    </View>

                    {/* <View style={styles.contactTypeBadge}>
                      <Text style={styles.contactTypeBadgeText}>
                        {item.kind === 'phone' ? 'Call' : 'Email'}
                      </Text>
                    </View> */}
                  </View>

                  <View style={styles.contactCardFooter}>
                    <Text style={styles.contactHint}>
                      {visualConfig.actionHelperText}
                    </Text>

                    <View
                      style={[
                        styles.actionChip,
                        {
                          backgroundColor: visualConfig.actionChipBackground,
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={16}
                        color={visualConfig.actionChipTextColor}
                      />
                      <Text
                        style={[
                          styles.actionChipText,
                          {
                            color: visualConfig.actionChipTextColor,
                          },
                        ]}
                      >
                        {visualConfig.actionLabel}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[10],
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(57, 175, 188, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  screenTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: '700',
    color: theme.colors.secondary,
    marginBottom: theme.spacing[1],
  },
  screenSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray700,
    lineHeight: 22,
    textAlign: 'center',
  },
  listCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    shadowColor: theme.colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  feedbackState: {
    paddingVertical: theme.spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    marginTop: theme.spacing[2],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.gray600,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.white,
  },
  contactCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  contactCardSpacing: {
    marginTop: theme.spacing[3],
  },
  contactCardPressed: {
    opacity: 0.92,
  },
  contactCardAccent: {
    position: 'absolute',
    top: -18,
    right: -18,
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  contactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  contactTextWrap: {
    flex: 1,
  },
  contactLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray500,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: '700',
    color: theme.colors.gray800,
  },
  contactTypeBadge: {
    minWidth: 58,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTypeBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  contactCardFooter: {
    marginTop: theme.spacing[3],
    paddingTop: theme.spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(31, 99, 122, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  contactHint: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.gray600,
    flex: 1,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: 10,
  },
  actionChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: '700',
  },
});
