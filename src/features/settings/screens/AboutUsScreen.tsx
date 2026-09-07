import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  View,
  Text,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppHeader } from '../../../components/ui';
import { theme } from '../../../theme';
import { staticScreenStyles as s } from '../settingsStaticScreens.styles';
import { settingsService } from '../service';

export function AboutUsScreen() {
  const [page, setPage] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadAboutUs = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await settingsService.fetchAboutUs();
      console.log('About Us response:', response);
      if (!response.data) {
        setPage(null);
        setErrorMessage(response.message || 'Could not load About Us.');
        return;
      }

      setPage({
        title: response.data.title?.trim() || 'About us',
        description: response.data.description?.trim() || '',
      });
    } catch {
      setPage(null);
      setErrorMessage('Could not load About Us.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAboutUs();
  }, [loadAboutUs]);

  return (
    <View style={s.container}>
      <AppHeader title="About us" showCartIcon={false} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <View style={s.hero}>
            <View style={s.heroIconWrap}>
              <MaterialIcons
                name="storefront"
                size={48}
                color={theme.colors.primary}
              />
            </View>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : errorMessage ? (
              <>
                <Text style={s.bodyText}>{errorMessage}</Text>
                <Pressable onPress={loadAboutUs}>
                  <Text style={s.sectionLabel}>Retry</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={s.appName}>{page?.title}</Text>
                <Text style={s.tagline}>{page?.description}</Text>
              </>
            )}
          </View>
        </View>

        <View style={s.versionPill}>
          <Text style={s.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
