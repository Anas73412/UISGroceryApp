import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  type ListRenderItem,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { AppHeader, usePullToRefresh } from '../../components/ui';
import { theme } from '../../theme';
import type { ComplainDetailModel } from '../../data/models/ComplainDetailModel';
import { useLoading } from '../../components/context/LoadingContext';
import { useMessageDialog } from '../../components/context/MessageDialogContext';
import { SUCCESS } from '../../utils/constants';
import { complainController } from './controller';
import styles from './ComplainScreen.Style';

const ComplainStatusCode = {
  PENDING: 0,
  IN_PROGRESS: 1,
  RESOLVED: 2,
  CANCELLED: 3,
} as const;

type ComplainStatusBadge = {
  label: string;
  bg: string;
  text: string;
};

const STATUS_BADGE_MAP: Record<number, ComplainStatusBadge> = {
  [ComplainStatusCode.PENDING]: {
    label: 'PENDING',
    bg: '#FFF3E0',
    text: '#E65100',
  },
  [ComplainStatusCode.IN_PROGRESS]: {
    label: 'IN PROGRESS',
    bg: '#E3F2FD',
    text: '#1565C0',
  },
  [ComplainStatusCode.RESOLVED]: {
    label: 'RESOLVED',
    bg: '#E8F5E9',
    text: '#2E7D32',
  },
  [ComplainStatusCode.CANCELLED]: {
    label: 'CANCELLED',
    bg: '#FFEBEE',
    text: '#C62828',
  },
};

function normalizeComplainStatus(status: number | string | undefined): number {
  const code = Number(status);
  if (Number.isFinite(code) && STATUS_BADGE_MAP[code]) {
    return code;
  }
  return ComplainStatusCode.PENDING;
}

function getComplainStatusBadge(status: number | string | undefined) {
  return STATUS_BADGE_MAP[normalizeComplainStatus(status)];
}

function formatComplainDate(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  const dateStr = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${dateStr}, ${timeStr}`;
}

function getAssigneeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

type MetaBlock =
  | { kind: 'customer'; label: string; value: string }
  | { kind: 'assignee'; label: string; value: string }
  | { kind: 'text'; label: string; value: string };

function getBottomMeta(item: ComplainDetailModel): MetaBlock {
  const status = normalizeComplainStatus(item.status);

  if (status === ComplainStatusCode.IN_PROGRESS) {
    return {
      kind: 'assignee',
      label: 'ASSIGNED TO',
      value: item.assign?.trim() || 'Not assigned yet',
    };
  }

  if (status === ComplainStatusCode.RESOLVED) {
    return {
      kind: 'text',
      label: 'CLOSED ON',
      value: formatComplainDate(item.resolve_time),
    };
  }

  if (status === ComplainStatusCode.CANCELLED) {
    return {
      kind: 'text',
      label: 'STATUS',
      value: formatComplainDate(item.created_at),
    };
  }

  return {
    kind: 'customer',
    label: 'CUSTOMER',
    value: item.user_name?.trim() || '—',
  };
}

type ComplainCardProps = {
  item: ComplainDetailModel;
};

function ComplainCard({ item }: ComplainCardProps) {
  const badge = getComplainStatusBadge(item.status);
  const isResolved =
    normalizeComplainStatus(item.status) === ComplainStatusCode.RESOLVED;
  const bottomMeta = getBottomMeta(item);

  return (
    <View style={styles.card}>
      {isResolved ? (
        <MaterialIcons
          name="check-circle"
          size={96}
          color={theme.colors.gray300}
          style={styles.cardWatermark}
        />
      ) : null}

      <View style={styles.cardTopRow}>
        <Text style={styles.complainId} numberOfLines={1}>
          #{item.complain_key}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.statusBadgeText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.gridCol}>
          <Text style={styles.fieldLabel}>PROBLEM TYPE</Text>
          <Text style={styles.fieldValue} numberOfLines={2}>
            {item.problem_type || '—'}
          </Text>
        </View>
        <View style={styles.gridCol}>
          <Text style={styles.fieldLabel}>PROBLEM</Text>
          <Text style={styles.fieldValue} numberOfLines={2}>
            {item.problem || '—'}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionBlock}>
        <Text style={styles.fieldLabel}>DESCRIPTION</Text>
        <Text style={styles.descriptionText} numberOfLines={4}>
          {item.description || '—'}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaCol}>
          <Text style={styles.fieldLabel}>CREATED ON</Text>
          <Text style={styles.metaValue}>
            {formatComplainDate(item.created_at)}
          </Text>
        </View>

        <View style={styles.metaColRight}>
          <Text style={[styles.fieldLabel, { textAlign: 'right' }]}>
            {bottomMeta.label}
          </Text>
          {bottomMeta.kind === 'assignee' ? (
            <View style={styles.assigneeRow}>
              <View style={styles.assigneeAvatar}>
                <Text style={styles.assigneeAvatarText}>
                  {getAssigneeInitials(bottomMeta.value)}
                </Text>
              </View>
              <Text style={styles.assigneeName} numberOfLines={2}>
                {bottomMeta.value}
              </Text>
            </View>
          ) : (
            <Text style={[styles.metaValue, { textAlign: 'right' }]}>
              {bottomMeta.value}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

type ComplainNav = NativeStackNavigationProp<
  SettingsStackParamList,
  'MyComplaints'
>;

export function ComplainScreen() {
  const navigation = useNavigation<ComplainNav>();
  const insets = useSafeAreaInsets();
  const { show, hide } = useLoading();
  const { showErrorDialog } = useMessageDialog();
  const [complaints, setComplaints] = useState<ComplainDetailModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadComplaints = useCallback(async () => {
    show('Loading...');
    try {
      const res = await complainController.fetchComplainList();
      if (res.status !== SUCCESS || !Array.isArray(res.data)) {
        setComplaints([]);
        if (res.message) showErrorDialog('Complaints', res.message);
        return;
      }
      const sorted = [...res.data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      setComplaints(sorted);
    } catch {
      setComplaints([]);
      showErrorDialog('Complaints', 'Could not load complaints.');
    } finally {
      hide();
    }
  }, [hide, show, showErrorDialog]);

  useFocusEffect(
    useCallback(() => {
      loadComplaints();
    }, [loadComplaints]),
  );

  const filteredComplaints = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return complaints;
    return complaints.filter(item => {
      const id = item.complain_key?.toLowerCase() ?? '';
      const problemType = item.problem_type?.toLowerCase() ?? '';
      return id.includes(q) || problemType.includes(q);
    });
  }, [complaints, searchQuery]);

  const renderItem: ListRenderItem<ComplainDetailModel> = ({ item }) => (
    <ComplainCard item={item} />
  );

  const fabBottom = Math.max(insets.bottom, 16) + theme.spacing[4];


  const handlePullRefresh = useCallback(async () => {
    await loadComplaints();
  }, [loadComplaints]);

  const { refreshControl } = usePullToRefresh(handlePullRefresh);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <AppHeader title="My Complaints" showCartIcon={false} />
      </View>

      <View style={styles.body}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color={theme.colors.gray500}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search by ID or problem type..."
            placeholderTextColor={theme.colors.gray500}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <FlatList
          data={filteredComplaints}
          keyExtractor={item => String(item.id ?? item.complain_key)}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>No complaints found.</Text>
          }
        />

        <View
          style={[styles.fabOverlay, { paddingBottom: fabBottom }]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddComplain')}
            accessibilityRole="button"
            accessibilityLabel="Add complaint"
          >
            <MaterialIcons name="add" size={32} color={theme.colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
