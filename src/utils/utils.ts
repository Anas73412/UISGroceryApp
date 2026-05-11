import { EARTH_RADIUS_KM } from './constants';

export function extractDataArray<T>(
  res: object | unknown[] | null | undefined,
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

export function toRad(def: number) {
  return (def * Math.PI) / 180;
}

export function distanceInKm(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): number {
  const dLat = toRad(endLat - startLat);
  const dLng = toRad(endLng - startLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(startLat)) *
      Math.cos(toRad(endLat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}
