import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppHeader } from '../../../components/ui';
import { theme } from '../../../theme';
import { staticScreenStyles as s } from '../settingsStaticScreens.styles';

export function AboutUsScreen() {
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
            <Text style={s.appName}>GroceryApp</Text>
            <Text style={s.tagline}>
              Your trusted store for quality groceries, delivered fresh. We
              connect you with the products you need for a healthier, easier
              day.
            </Text>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabel}>What we do</Text>
          <Text style={s.bodyText}>
            We work with reliable suppliers to bring you fresh produce,
            household essentials, and specialty items. Our goal is a simple
            shopping experience: browse, order, and enjoy.
          </Text>
        </View>

        <View style={s.card}>
          <Text style={s.sectionLabel}>Our values</Text>
          <View style={[s.valueRow, s.valueRowFirst]}>
            <View style={s.valueIcon}>
              <MaterialIcons
                name="eco"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={s.valueTextCol}>
              <Text style={s.valueLabel}>Quality & freshness</Text>
              <Text style={s.valueValue}>Sourced and packed with care</Text>
            </View>
          </View>
          <View style={s.valueRow}>
            <View style={s.valueIcon}>
              <MaterialIcons
                name="groups"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={s.valueTextCol}>
              <Text style={s.valueLabel}>People first</Text>
              <Text style={s.valueValue}>Support that listens to you</Text>
            </View>
          </View>
          <View style={[s.valueRow, { borderBottomWidth: 0 }]}>
            <View style={s.valueIcon}>
              <MaterialIcons
                name="verified"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={s.valueTextCol}>
              <Text style={s.valueLabel}>Trust</Text>
              <Text style={s.valueValue}>Clear prices & secure experience</Text>
            </View>
          </View>
        </View>

        <View style={s.versionPill}>
          <Text style={s.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
