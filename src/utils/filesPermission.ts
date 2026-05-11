import { PermissionsAndroid, Platform } from 'react-native';

export type FilesPermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

function androidApiLevel(): number {
  if (Platform.OS !== 'android') return 0;
  return typeof Platform.Version === 'number'
    ? Platform.Version
    : parseInt(Platform.Version, 10);
}

async function requestSingle(
  permission: Parameters<typeof PermissionsAndroid.request>[0],
): Promise<FilesPermissionStatus> {
  const already = await PermissionsAndroid.check(permission);
  if (already) return 'granted';

  const result = await PermissionsAndroid.request(permission, {
    title: 'Files & Media access',
    message: 'Allow access to your photos and files to set a profile picture and attach images.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  });

  if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
  return 'denied';
}

export async function ensureFilesPermission(): Promise<FilesPermissionStatus> {
  // iOS prompts on first picker open; treat as granted at startup.
  if (Platform.OS === 'ios') return 'granted';

  if (Platform.OS !== 'android') return 'unavailable';

  const api = androidApiLevel();
  if (api < 23) return 'granted';

  // Android 13+ uses scoped media permissions.
  if (api >= 33) {
    const imagesStatus = await requestSingle(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );
    if (imagesStatus !== 'granted') return imagesStatus;
    return 'granted';
  }

  return requestSingle(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
}
