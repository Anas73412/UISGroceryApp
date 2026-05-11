import { PermissionsAndroid, Platform } from 'react-native';
import GeoLocation from 'react-native-geolocation-service';

export type LocationPermissionStatus =
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

export async function ensureLocationPermission(): Promise<LocationPermissionStatus> {
  if (Platform.OS === 'ios') {
    const result = await GeoLocation.requestAuthorization('whenInUse');
    if (result === 'granted') return 'granted';
    if (result === 'denied') return 'blocked';
    return 'unavailable';
  }

  if (Platform.OS !== 'android') return 'unavailable';
  if (androidApiLevel() < 23) return 'granted';

  const alreadyGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (alreadyGranted) return 'granted';

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message: 'Allow location access to detect your location for delivery',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );

  if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'blocked';
  return 'denied';
}
