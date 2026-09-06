import React from 'react';
import { View, Text } from 'react-native';
import type { ProductRequestModel } from '../../../data/models/ProductRequestModel';
import {
  getProductRequestStatusBadge,
  normalizeProductRequestStatus,
} from '../../../data/models/ProductRequestModel';
import { IMAGE_BASE_URL } from '../../../utils/constants';
import styles from '../MyProductRequestScreen.Style';
import { RemoteImage } from '../../../components/ui/RemoteImage/RemoteImage';

function formatRequestDate(value: string | number): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';

  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return `${month} ${day} ${time}, ${year}`;
}

function getImageUri(image?: string): string {
  const raw = image?.trim() ?? '';
  if (!raw) return '';
  return raw.startsWith('http') ? raw : `${IMAGE_BASE_URL}${raw}`;
}

type RequestCardProps = {
  request: ProductRequestModel;
};

export function RequestCard({ request }: RequestCardProps) {
  const statusCode = normalizeProductRequestStatus(request.status);
  const badge = getProductRequestStatusBadge(statusCode);
  const imageUri = getImageUri(request.imageUrl ?? request.productImage);
  const remarks = request.remark ?? [];
  const hasRemarks = remarks.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.thumbWrap}>
          <RemoteImage
            uri={imageUri}
            style={styles.thumb}
            resizeMode="contain"
          />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.productName} numberOfLines={2}>
              {request.productName}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                {badge.label}
              </Text>
            </View>
          </View>

          <Text style={styles.metaText}>Qty: {request.quantity}</Text>
          {request.description ? (
            <Text style={styles.metaText} numberOfLines={2}>
              {request.description}
            </Text>
          ) : null}

          <Text style={styles.timestamp}>
            {formatRequestDate(request.createdAt)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.remarksHeading}>Remarks:</Text>
      <View style={styles.remarksBox}>
        {hasRemarks ? (
          remarks.map((remark, index) => {
            const remarkBadge =
              remark.statusCode != null
                ? getProductRequestStatusBadge(remark.statusCode)
                : null;
            return (
              <View
                key={`${request.id}-remark-${index}`}
                style={[
                  styles.remarkRow,
                  index < remarks.length - 1 && styles.remarkRowBorder,
                ]}
              >
                {remarkBadge ? (
                  <View
                    style={[
                      styles.remarkBadge,
                      { backgroundColor: remarkBadge.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.remarkBadgeText,
                        { color: remarkBadge.text },
                      ]}
                    >
                      {remarkBadge.label}
                    </Text>
                  </View>
                ) : null}
                <Text style={styles.remarkText}>{remark.remarkText}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.remarkPlaceholder}>
            No updates yet. Request is under review.
          </Text>
        )}
      </View>
    </View>
  );
}
