import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../theme';
import { RUPEE_SIGN } from '../../../utils/constants';
import styles from './WiFiDashboard.style';

export type WiFiDashboardData = {
  serviceName: string;
  activePlanName: string;
  connectionName: string;
  connectionId: string;
  dataLabel: string;
  planAmount: string;
  billedOn: string;
  overdueMessage?: string;
};

type WiFiDashboardSectionsProps = {
  data: WiFiDashboardData;
  onServiceDetailsPress?: () => void;
  onPlanDetailsPress?: () => void;
  onUpdatePress?: () => void;
  onViewBillsPress?: () => void;
};

export function WiFiDashboardSections({
  data,
  onServiceDetailsPress,
  onPlanDetailsPress,
  onUpdatePress,
  onViewBillsPress,
}: WiFiDashboardSectionsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.servicePlanRow}>
          <View style={styles.servicePlanColumn}>
            <Text style={styles.sectionLabel}>Services</Text>
            <Text style={styles.serviceValue}>{data.serviceName}</Text>
            <Pressable style={styles.detailsButton} onPress={onServiceDetailsPress}>
              <Text style={styles.detailsButtonText}>View details</Text>
            </Pressable>
          </View>

          <View style={styles.servicePlanDivider} />

          <View style={styles.servicePlanColumn}>
            <Text style={styles.sectionLabel}>Active Plan</Text>
            <Text style={styles.planValue}>{data.activePlanName}</Text>
            <Pressable style={styles.detailsButton} onPress={onPlanDetailsPress}>
              <Text style={styles.detailsButtonText}>View details</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.connectionCard]}>
        <View style={styles.connectionHeader}>
          <View style={styles.routerIconWrap}>
            <MaterialIcons name="router" size={22} color={theme.colors.primary} />
          </View>
          <Text style={styles.connectionTitle} numberOfLines={1}>
            {data.connectionName} – {data.connectionId}
          </Text>
          <Pressable style={styles.updateLink} onPress={onUpdatePress}>
            <Text style={styles.updateText}>Update</Text>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={theme.colors.gray800}
            />
          </Pressable>
        </View>

        <View style={styles.horizontalDivider} />

        <View style={styles.infoRow}>
          <View style={styles.infoColumn}>
            <Text style={styles.connectionLabel}>Data</Text>
            <Text style={styles.infoValue}>{data.dataLabel}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.connectionLabel}>Plan</Text>
            <Text style={styles.infoValue}>
              {RUPEE_SIGN}
              {data.planAmount}
            </Text>
            <Text style={styles.billedOnText}>Billed On: {data.billedOn}</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          {data.overdueMessage ? (
            <Text style={styles.overdueText}>{data.overdueMessage}</Text>
          ) : (
            <View style={styles.footerSpacer} />
          )}
          <Pressable style={styles.viewBillsButton} onPress={onViewBillsPress}>
            <Text style={styles.viewBillsButtonText}>View Bills</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
