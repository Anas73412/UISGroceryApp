import type { PlanModel } from '../../../data/models/PlanModel';
import type { UserServiceModel } from '../model';
import type { WiFiDashboardData } from './WiFiDashboardSections';

const EMPTY_WIFI_DASHBOARD: WiFiDashboardData = {
  serviceName: '—',
  activePlanName: '—',
  connectionName: '—',
  connectionId: '—',
  dataLabel: '—',
  planAmount: '0',
  billedOn: '—',
  overdueMessage: undefined,
};

function formatPlanAmount(value: number | null | undefined): string {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return '0.00';
  return amount % 1 === 0 ? amount.toFixed(2) : amount.toFixed(2);
}

function formatBilledOn(value: string | null | undefined): string {
  if (!value?.trim()) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.trim();

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function buildOverdueMessage(
  value: string | null | undefined,
): string | undefined {
  if (!value?.trim()) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const today = new Date();

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const startOfBillDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const differenceInDays = Math.floor(
    (startOfBillDay.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Overdue
  if (differenceInDays < 0) {
    const overdueDays = Math.abs(differenceInDays);

    return `Bill is overdue by ${overdueDays} day${
      overdueDays === 1 ? '' : 's'
    }`;
  }

  // Ends today
  if (differenceInDays === 0) {
    return 'Your plan ends today';
  }

  // Ends tomorrow
  if (differenceInDays === 1) {
    return 'Your plan ends tomorrow';
  }

  // Ends within 5 days
  if (differenceInDays <= 5) {
    return `Your plan ends in ${differenceInDays} days`;
  }

  // More than 5 days remaining
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });

  return `Your plan ends on ${formattedDate}`;
}

export function pickCurrentPlan(
  data: PlanModel[] | PlanModel | null | undefined,
): PlanModel | null {
  if (!data) return null;
  return Array.isArray(data) ? data[0] ?? null : data;
}

export function pickActiveService(
  data: UserServiceModel[] | UserServiceModel | null | undefined,
): UserServiceModel | null {
  if (!data) return null;
  return Array.isArray(data) ? data[0] ?? null : data;
}

export function buildWiFiDashboardData(input?: {
  plan?: PlanModel | null;
  service?: UserServiceModel | null;
  billedOn?: string | null;
}): WiFiDashboardData {
  const plan = input?.plan ?? null;
  const service = input?.service ?? null;
  const billedOnRaw = '2026-09-17'; //plan?.planEndDate ?? null;

  const planAmount = plan?.pricewithgst || plan?.planprice;
  const activePlanName =
    plan?.planType?.trim() ||
    plan?.offertype?.trim() ||
    EMPTY_WIFI_DASHBOARD.activePlanName;

  return {
    serviceName:
      service?.service_name?.trim() || EMPTY_WIFI_DASHBOARD.serviceName,
    activePlanName,
    connectionName:
      service?.device_name?.trim() || EMPTY_WIFI_DASHBOARD.connectionName,
    connectionId:
      service?.service_key?.trim() || EMPTY_WIFI_DASHBOARD.connectionId,
    dataLabel: `${plan?.speed.trim()} Mbps` || EMPTY_WIFI_DASHBOARD.dataLabel,
    planAmount: formatPlanAmount(planAmount),
    billedOn: formatBilledOn(billedOnRaw),
    overdueMessage: buildOverdueMessage(billedOnRaw),
  };
}
