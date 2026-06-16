import { BillDetailModel } from '../../data/models/BillDetailModel';
import type { BillItem, BillStatus } from './types';

function formatBillDate(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatBillTimestamp(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const dateStr = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${dateStr}, ${timeStr}`;
}

function resolveBillStatus(
  status: number | undefined,
  paidAmount: number,
  dueAmount: number,
): BillStatus {
  if (status === 1) return 'PAID';
  if (status === 2) return 'PARTIALLY PAID';
  if (status === 0) return 'PENDING';

  if (dueAmount <= 0 && paidAmount > 0) return 'PAID';
  if (paidAmount > 0 && dueAmount > 0) return 'PARTIALLY PAID';
  return 'PENDING';
}

export function mapBillDetailToItem(bill: BillDetailModel): BillItem {
  const paidAmount = bill.paidAmount ?? 0;
  const dueAmount = bill.dueAmount ?? 0;

  return {
    id: String(bill.id ?? bill.invoiveNo ?? bill.billFile ?? Math.random()),
    invoiceNumber: bill.invoiveNo ? `#${bill.invoiveNo}` : '—',
    amount: bill.grandtotal ?? 0,
    date: formatBillDate(bill.billdate),
    paidAmount,
    dueAmount,
    status: resolveBillStatus(bill.status, paidAmount, dueAmount),
    updatedAt: formatBillTimestamp(bill.createddate ?? bill.billdate),
    billFile: bill.billFile ?? '',
  };
}

export function mapBillListToItems(bills: BillDetailModel[] | null | undefined): BillItem[] {
  if (!bills?.length) return [];
  return bills.map(mapBillDetailToItem);
}
