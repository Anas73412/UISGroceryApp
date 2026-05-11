import { PermissionsAndroid, Platform } from 'react-native';

export type ContactsPermissionStatus =
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

export async function ensureContactsPermission(): Promise<ContactsPermissionStatus> {
  // iOS: needs a contacts library (e.g. react-native-contacts) to actually
  // request. Until one is added, treat it as unavailable so the UI can
  // explain that it will be asked later in context.
  if (Platform.OS === 'ios') return 'unavailable';

  if (Platform.OS !== 'android') return 'unavailable';
  if (androidApiLevel() < 23) return 'granted';

  const already = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
  );
  if (already) return 'granted';

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    {
      title: 'Contacts access',
      message: 'Allow access to your contacts to share orders with friends.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );

  if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
  return 'denied';
}
