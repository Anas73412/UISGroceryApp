import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

Geocoder.init('AIzaSyBo4vmc-fAR4PlufCIlyzWWYDgbvM-US2o');

export type LocationResult = {
  lat: number;
  lng: number;
  address: string;
  postalCode: string;
};

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
} as const;

function getPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => reject(error),
      GEO_OPTIONS,
    );
  });
}

async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{ address: string; postalCode: string }> {
  try {
    const response = await Geocoder.from({ lat, lng });
    const first = response.results?.[0];
    if (!first) return { address: '', postalCode: '' };

    const get = (type: string) => {
      const component = first.address_components.find(c =>
        c.types.includes(type),
      );
      return component ? component.long_name : '';
    };

    const route = get('route');
    const streetNumber = get('street_number');
    const postalCode = get('postal_code');
    const locality = get('locality');
    const subAdmin = get('administrative_area_level_2');
    const adminArea = get('administrative_area_level_1');

    const parts = [route, streetNumber, locality, subAdmin, adminArea].filter(
      Boolean,
    );
    const address = parts.length
      ? parts.join(', ')
      : first.formatted_address || '';

    return { address, postalCode };
  } catch (error) {
    return { address: '', postalCode: '' };
  }
}

export async function getCurrentLocation(): Promise<LocationResult | null> {
  try {
    const { lat, lng } = await getPosition();
    const { address, postalCode } = await reverseGeocode(lat, lng);
    return { lat, lng, address, postalCode };
  } catch (error) {
    return null;
  }
}

/** Reverse-geocode fixed coordinates (e.g. map pin or navigation params). */
export async function getLocationFromCoordinates(
  lat: number,
  lng: number,
): Promise<LocationResult> {
  const { address, postalCode } = await reverseGeocode(lat, lng);
  return { lat, lng, address, postalCode };
}
