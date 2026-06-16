import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../theme';
import { RUPEE_SIGN } from '../../../utils/constants';
import type { BillItem, BillStatus } from '../types';
import styles from './BillCard.style';

type StatusStyle = {
  label: string;
  backgroundColor: string;
  textColor: string;
};

const STATUS_STYLES: Record<BillStatus, StatusStyle> = {
  PAID: {
    label: 'PAID',
    backgroundColor: '#E8F5E9',
    textColor: '#2E7D32',
  },
  'PARTIALLY PAID': {
    label: 'PARTIALLY PAID',
    backgroundColor: '#FFF3E0',
    textColor: '#E65100',
  },
  PENDING: {
    label: 'PENDING',
    backgroundColor: theme.colors.gray100,
    textColor: theme.colors.gray600,
  },
};

type BillCardProps = {
  bill: BillItem;
  onPdfPress?: (bill: BillItem) => void;
};

export function BillCard({ bill, onPdfPress }: BillCardProps) {
  const statusStyle = STATUS_STYLES[bill.status];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.invoiceBlock}>
          <Text style={styles.fieldLabel}>Invoice Number</Text>
          <Text style={styles.invoiceNumber}>{bill.invoiceNumber}</Text>
        </View>
        <Pressable
          style={styles.pdfButton}
          onPress={() => onPdfPress?.(bill)}
          hitSlop={8}
        >
          <MaterialIcons
            name="picture-as-pdf"
            size={22}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>

      <View style={styles.amountDateRow}>
        <View style={styles.amountDateColumn}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <Text style={styles.amountValue}>
            {RUPEE_SIGN}
            {bill.amount.toFixed(1)}
          </Text>
        </View>
        <View style={styles.amountDateColumn}>
          <Text style={styles.fieldLabel}>Date</Text>
          <Text style={styles.dateValue}>{bill.date}</Text>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>Paid Amount</Text>
          <Text style={styles.summaryValue}>
            {RUPEE_SIGN}
            {bill.paidAmount.toFixed(1)}
          </Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>Due Amount</Text>
          <Text style={styles.summaryValue}>
            {RUPEE_SIGN}
            {bill.dueAmount.toFixed(1)}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
            {statusStyle.label}
          </Text>
        </View>
        <View style={styles.timestampRow}>
          <MaterialIcons
            name="schedule"
            size={12}
            color={theme.colors.gray500}
          />
          <Text style={styles.timestampText}>{bill.updatedAt}</Text>
        </View>
      </View>
    </View>
  );
}
