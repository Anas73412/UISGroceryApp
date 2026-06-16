export type BillStatus = 'PAID' | 'PARTIALLY PAID' | 'PENDING';

export type BillItem = {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  paidAmount: number;
  dueAmount: number;
  status: BillStatus;
  updatedAt: string;
  billFile: string;
};

export const MOCK_BILLS: BillItem[] = [
  {
    id: '1',
    invoiceNumber: '#2026-0029',
    amount: 767,
    date: '07 May 2026',
    paidAmount: 10000,
    dueAmount: 767,
    status: 'PAID',
    updatedAt: '07 May 2026, 02:17 pm',
    billFile: '',
  },
  {
    id: '2',
    invoiceNumber: '#2026-0026',
    amount: 767,
    date: '04 May 2026',
    paidAmount: 10000,
    dueAmount: 767,
    status: 'PARTIALLY PAID',
    updatedAt: '04 May 2026, 02:17 pm',
    billFile: '',
  },
  {
    id: '3',
    invoiceNumber: '#2026-0025',
    amount: 767,
    date: '03 May 2026',
    paidAmount: 10000,
    dueAmount: 767,
    status: 'PENDING',
    updatedAt: '03 May 2026, 02:17 pm',
    billFile: '',
  },
  {
    id: '4',
    invoiceNumber: '#2026-0024',
    amount: 767,
    date: '02 May 2026',
    paidAmount: 10000,
    dueAmount: 767,
    status: 'PENDING',
    updatedAt: '02 May 2026, 02:17 pm',
    billFile: '',
  },
  {
    id: '5',
    invoiceNumber: '#2026-0022',
    amount: 767,
    date: '23 Apr 2026',
    paidAmount: 10000,
    dueAmount: 767,
    status: 'PENDING',
    updatedAt: '23 Apr 2026, 02:17 pm',
    billFile: '',
  },
];
