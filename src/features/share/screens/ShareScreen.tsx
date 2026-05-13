import React, { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, Share, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button } from '../../../components/ui';
import { useLoading } from '../../../components/context/LoadingContext';
import { useMessageDialog } from '../../../components/context/MessageDialogContext';
import styles from './ShareScreen.Style';
import { theme } from '../../../theme';
import { shareController } from '../controller';

export function ShareScreen() {
  const [referUrl, setReferUrl] = useState('');
  const [referMessage, setReferMessage] = useState('');
  const { show, hide } = useLoading();
  const { showErrorDialog } = useMessageDialog();

  const loadShareContent = useCallback(async () => {
    show('Loading share details...');
    try {
      const config = await shareController.getShareConfigFromDB();
      setReferUrl(config.referUrl);
      setReferMessage(config.referMessage);
    } finally {
      hide();
    }
  }, [hide, show]);

  useFocusEffect(
    useCallback(() => {
      void loadShareContent();
    }, [loadShareContent]),
  );

  const handleShare = useCallback(async () => {
    const shareText = [referMessage, referUrl].filter(Boolean).join('\n\n');

    if (!shareText) {
      showErrorDialog(
        'Share unavailable',
        'Referral details are not available right now. Please try again later.',
      );
      return;
    }

    try {
      await Share.share({
        title: 'Share Grocery App',
        message: shareText,
      });
    } catch (error: any) {
      showErrorDialog(
        'Share failed',
        error?.message || 'Unable to open the share sheet right now.',
      );
    }
  }, [referMessage, referUrl, showErrorDialog]);

  const hasShareContent = referMessage.length > 0 || referUrl.length > 0;
  const shareHighlights = [
    {
      icon: 'groups',
      title: 'Invite friends',
      subtitle: 'Send your app invite to friends and family in one tap.',
    },
    {
      icon: 'bolt',
      title: 'Quick sharing',
      subtitle: 'Use the native share sheet to send your referral instantly.',
    },
    {
      icon: 'local-offer',
      title: 'Referral ready',
      subtitle:
        'Your saved referral details are used automatically in the share.',
    },
  ] as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>REFER AND SHARE</Text>
          <Text style={styles.title}>Invite friends to GroceryApp</Text>
          <Text style={styles.subtitle}>
            A simple and clean sharing screen for inviting others to try your
            app.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroArtwork}>
            <View style={styles.heroArtworkCircleLarge}>
              <MaterialIcons
                name="share"
                size={36}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.heroArtworkCircleSmallLeft}>
              <MaterialIcons
                name="person-add-alt-1"
                size={22}
                color={theme.colors.secondary}
              />
            </View>
            <View style={styles.heroArtworkCircleSmallRight}>
              <MaterialIcons
                name="send"
                size={20}
                color={theme.colors.success}
              />
            </View>
          </View>
          <Text style={styles.heroTitle}>Spread the word</Text>
          <Text style={styles.heroText}>
            Send your invite message to friends and family so they can discover
            your grocery app quickly.
          </Text>
        </View>

        <View style={styles.featureGrid}>
          {shareHighlights.map(item => (
            <View key={item.title} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureSubtitle}>{item.subtitle}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calloutCard}>
          <View style={styles.calloutIconWrap}>
            <MaterialIcons
              name="share"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.calloutContent}>
            <Text style={styles.calloutTitle}>Ready to share</Text>
            <Text style={styles.calloutText}>
              Tap the button below to open the native share sheet with your
              referral details.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.helperText}>
            {hasShareContent
              ? 'Share your invite in one tap.'
              : 'Referral details are not available right now.'}
          </Text>
          <Button
            title="Share Now"
            onPress={handleShare}
            disabled={!hasShareContent}
            containerStyle={styles.shareButton}
            textStyle={styles.shareButtonText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
