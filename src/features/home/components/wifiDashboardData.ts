import type { UserModel } from '../../../data/models/UserModel';

import type { WiFiDashboardData } from './WiFiDashboardSections';

const DEFAULT_WIFI_DASHBOARD: WiFiDashboardData = {
  serviceName: 'Wifi User',
  activePlanName: 'PRIME +',
  connectionName: 'Fusionnet4',
  connectionId: 'JJ7UV1S3',
  dataLabel: '150 Unlimited',
  planAmount: '767.0',
  billedOn: '24th Nov',
  overdueMessage: 'Bill is overdue by 204 days',
};

export function buildWiFiDashboardData(
  user: UserModel | null | undefined,
): WiFiDashboardData {
  if (!user) return DEFAULT_WIFI_DASHBOARD;

  const planId = user.planId ?? 0;

  return {
    ...DEFAULT_WIFI_DASHBOARD,
    serviceName: 'Wifi User',
    activePlanName: planId > 0 ? `Plan ${planId}` : DEFAULT_WIFI_DASHBOARD.activePlanName,
    connectionName: user.name?.trim() || DEFAULT_WIFI_DASHBOARD.connectionName,
    connectionId: user.mobile?.trim() || DEFAULT_WIFI_DASHBOARD.connectionId,
  };
}
