export function extractDataArray<T>(
  res: Record<string, unknown> | unknown[] | null | undefined,
  path: string[] = ['data'],
): T[] {
  if (res == null) return [];
  if (Array.isArray(res)) return res as T[];
  let value: unknown = res;
  for (const key of path) {
    value = (value as Record<string, unknown>)?.[key];
    if (value == null) return [];
  }
  return Array.isArray(value) ? (value as T[]) : [];
}
