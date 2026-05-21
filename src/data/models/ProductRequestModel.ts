/** API numeric status codes for product requests. */
export const ProductRequestStatusCode = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2, //REJECTED
  PURCHASED: 3, //PURCHASED
  DELIVERED: 4, //Delivered
  CANCELLED: 5,
} as const;

export type ProductRequestStatus =
  (typeof ProductRequestStatusCode)[keyof typeof ProductRequestStatusCode];

export type ProductRequestRemark = {
  statusCode?: number;
  remarkText: string;
};

export type ProductRequestModel = {
  id: number;
  userId: number;
  productName: string;
  quantity: string;
  imageUrl: string;
  description: string;
  status: number;
  productImage?: string;
  createdAt: string | number;
  updatedAt: string | number;
  remark: ProductRequestRemark[];
};

export type CreateProductRequestPayload = {
  userId: number;
  productName: string;
  quantity: string;
  description?: string;
  imageUri?: string;
};

export type ProductRequestStatusBadge = {
  label: string;
  bg: string;
  text: string;
};

const STATUS_BADGE_MAP: Record<number, ProductRequestStatusBadge> = {
  [ProductRequestStatusCode.PENDING]: {
    label: 'PENDING',
    bg: '#F9A825',
    text: '#FFFFFF',
  },
  [ProductRequestStatusCode.APPROVED]: {
    label: 'APPROVED',
    bg: '#2E7D32',
    text: '#FFFFFF',
  },
  [ProductRequestStatusCode.PURCHASED]: {
    label: 'PURCHASED',
    bg: '#1565C0',
    text: '#FFFFFF',
  },
  [ProductRequestStatusCode.DELIVERED]: {
    label: 'DELIVERED',
    bg: '#43A047',
    text: '#FFFFFF',
  },
  [ProductRequestStatusCode.CANCELLED]: {
    label: 'CANCELLED',
    bg: '#DC2626',
    text: '#FFFFFF',
  },
  [ProductRequestStatusCode.REJECTED]: {
    label: 'REJECTED',
    bg: '#DC2626',
    text: '#FFFFFF',
  },
};

/** Coerce API value (number or numeric string) to a status code. */
export function normalizeProductRequestStatus(
  value: unknown,
  fallback: number = ProductRequestStatusCode.PENDING,
): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

export function getProductRequestStatusBadge(
  status: number,
): ProductRequestStatusBadge {
  return (
    STATUS_BADGE_MAP[status] ??
    STATUS_BADGE_MAP[ProductRequestStatusCode.PENDING]
  );
}

function tryParseRemarkJson(value: string): unknown | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
    return null;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

function normalizeRemarkEntry(raw: unknown): ProductRequestRemark | null {
  if (raw == null) {
    return null;
  }
  if (typeof raw === 'string') {
    const parsed = tryParseRemarkJson(raw);
    if (parsed != null) {
      return null;
    }
    const remarkText = raw.trim();
    return remarkText ? { remarkText } : null;
  }
  if (typeof raw === 'object') {
    const row = raw as Record<string, unknown>;
    const remarkText = String(
      row.remarkText ?? row.message ?? row.text ?? row.remark ?? '',
    ).trim();
    if (!remarkText) {
      return null;
    }
    const statusRaw = row.statusCode ?? row.status;
    return {
      remarkText,
      statusCode:
        statusRaw != null
          ? normalizeProductRequestStatus(statusRaw)
          : undefined,
    };
  }
  return null;
}

/** API may send remark as JSON string, array, object, or plain text. */
export function normalizeRemarks(remark: unknown): ProductRequestRemark[] {
  if (remark == null) {
    return [];
  }

  if (typeof remark === 'string') {
    const parsed = tryParseRemarkJson(remark);
    if (parsed != null) {
      return normalizeRemarks(parsed);
    }
    const single = normalizeRemarkEntry(remark);
    return single ? [single] : [];
  }

  if (Array.isArray(remark)) {
    return remark
      .map(normalizeRemarkEntry)
      .filter((r): r is ProductRequestRemark => r != null);
  }

  const single = normalizeRemarkEntry(remark);
  return single ? [single] : [];
}

export function normalizeProductRequestItem(
  item: ProductRequestModel | Record<string, unknown>,
): ProductRequestModel {
  const row = item as Record<string, unknown>;
  const remarkRaw = row.remark ?? row.remarks ?? row.remarkList;

  return {
    id: Number(row.id ?? 0),
    userId: Number(row.userId ?? 0),
    productName: String(row.productName ?? ''),
    quantity: String(row.quantity ?? ''),
    imageUrl: String(row.imageUrl ?? row.productImage ?? ''),
    description: String(row.description ?? row.categoryName ?? ''),
    status: normalizeProductRequestStatus(row.status),
    productImage: row.productImage ? String(row.productImage) : undefined,
    createdAt: (row.createdAt ?? '') as string | number,
    updatedAt: (row.updatedAt ?? '') as string | number,
    remark: normalizeRemarks(remarkRaw),
  };
}
