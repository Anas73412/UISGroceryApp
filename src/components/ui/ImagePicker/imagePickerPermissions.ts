import { Platform, PermissionsAndroid, type Permission } from 'react-native';

function androidApiLevel(): number {
  if (Platform.OS !== 'android') {
    return 0;
  }
  return typeof Platform.Version === 'number'
    ? Platform.Version
    : parseInt(String(Platform.Version), 10);
}

async function requestAndroidPermission(
  permission: Permission,
  rationale: {
    title: string;
    message: string;
    buttonPositive: string;
    buttonNegative?: string;
  },
): Promise<boolean> {
  const granted = await PermissionsAndroid.check(permission);
  if (granted) {
    return true;
  }
  const result = await PermissionsAndroid.request(permission, rationale);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

/**
 * Android: requests runtime CAMERA before opening the camera.
 * iOS: declarations in Info.plist; system prompt when the picker runs.
 */
export async function ensureCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return true;
  }
  if (Platform.OS === 'ios') {
    return true;
  }
  if (androidApiLevel() < 23) {
    return true;
  }
  return requestAndroidPermission(PermissionsAndroid.PERMISSIONS.CAMERA, {
    title: 'Camera access',
    message: 'Allow camera access to take a new profile photo.',
    buttonPositive: 'Allow',
    buttonNegative: 'Cancel',
  });
}

/**
 * Android: requests photo read permission (storage or READ_MEDIA_IMAGES by API level).
 */
export async function ensurePhotoLibraryPermission(): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return true;
  }
  if (Platform.OS === 'ios') {
    return true;
  }
  const api = androidApiLevel();
  if (api < 23) {
    return true;
  }
  if (api >= 33) {
    return requestAndroidPermission(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      {
        title: 'Photos access',
        message: 'Allow access to your photos to choose a profile picture.',
        buttonPositive: 'Allow',
        buttonNegative: 'Cancel',
      },
    );
  }
  return requestAndroidPermission(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: 'Storage access',
      message: 'Allow access to your photos to choose a profile picture.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    },
  );
}
