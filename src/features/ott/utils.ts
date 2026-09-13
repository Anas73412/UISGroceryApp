import { IMAGE_BASE_URL } from '../../utils/constants';

export function ottImageUri(path: string): string | undefined {
  const value = path.trim();
  if (!value) return undefined;
  return value.startsWith('http')
    ? value
    : `${IMAGE_BASE_URL}${value.replace(/^\//, '')}`;
}
