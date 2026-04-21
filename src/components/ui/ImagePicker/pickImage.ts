import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
  PhotoQuality,
} from 'react-native-image-picker';
import { ImagePickerMode, PickedImageAsset } from './ImagePicker.types';

function mapAsset(a: Asset): PickedImageAsset | null {
  const uri = a.uri;
  if (!uri) {
    return null;
  }

  return {
    uri: a.uri ? a.uri : '',
    type: a.type,
    width: a.width,
    height: a.height,
    fileName: a.fileName,
    fileSize: a.fileSize,
  };
}

export function mapAssetsToPicked(
  assets: Asset[] | undefined,
): PickedImageAsset[] {
  if (!assets?.length) return [];
  return assets.map(mapAsset).filter((a): a is PickedImageAsset => a !== null);
}

export function baseLiberaryOptions(
  mode: ImagePickerMode,
  maxFiles?: number,
  quality?: PhotoQuality,
  maxWidth?: number | undefined,
  maxHeight?: number | undefined,
): ImageLibraryOptions {
  const selectionLimit = mode === 'single' ? 1 : Math.max(1, maxFiles ?? 1);
  return {
    mediaType: 'photo',
    selectionLimit,
    quality,
    maxWidth,
    maxHeight,
  };
}

export type PickResult = {
  assets: PickedImageAsset[];
  errorMessage?: string;
};

export function pickGallary(
  mode: ImagePickerMode,
  maxFiles: number,
  quality: PhotoQuality,
  maxWidth: number | undefined,
  maxHeight: number | undefined,
): Promise<PickResult> {
  const option = baseLiberaryOptions(
    mode,
    maxFiles,
    quality,
    maxWidth,
    maxHeight,
  );
  return new Promise(resolve => {
    launchImageLibrary(option, response => {
      if (response.didCancel) {
        resolve({ assets: [] });
        return;
      }

      if (response.errorCode != null) {
        resolve({
          assets: [],
          errorMessage:
            response.errorMessage ??
            (response.errorCode === 'permission'
              ? 'Photo liberary permission denied'
              : 'could not open gallary'),
        });
        return;
      }
      resolve({
        assets: mapAssetsToPicked(response.assets),
      });
    });
  });
}

export function pickFromCamera(
  quality: PhotoQuality,
  maxWidth: number | undefined,
  maxHeight: number | undefined,
): Promise<PickResult> {
  const options: CameraOptions = {
    mediaType: 'photo',
    quality,
    maxWidth,
    maxHeight,
    saveToPhotos: false,
  };

  return new Promise(resolve => {
    launchCamera(options, response => {
      if (response.didCancel) {
        resolve({ assets: [] });
        return;
      }

      if (response.errorCode != null) {
        resolve({
          assets: [],
          errorMessage:
            response.errorMessage ??
            (response.errorCode === 'permission'
              ? 'Camera Permission denied.'
              : 'could not open camera.'),
        });
        return;
      }
      resolve({ assets: mapAssetsToPicked(response.assets) });
    });
  });
}
