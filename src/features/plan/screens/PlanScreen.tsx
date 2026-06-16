import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { sessionStore } from '../../../store/sessionStore';
import { theme } from '../../../theme';
import styles from './PlanScreen.Style';

export function PlanScreen() {
  const user = sessionStore(state => state.user);
  const planId = user?.planId ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MY PLAN</Text>
          <Text style={styles.title}>Your WiFi Plan</Text>
          <Text style={styles.subtitle}>
            View your active United Internet Service plan details.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <MaterialIcons
              name="wifi"
              size={36}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.heroTitle}>
            {planId > 0 ? `Plan #${planId}` : 'Active WiFi User'}
          </Text>
          <Text style={styles.heroText}>
            {planId > 0
              ? 'Your plan is linked to this account. Contact support for billing or upgrade details.'
              : 'Your account has WiFi access. Plan details will appear here once assigned.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
