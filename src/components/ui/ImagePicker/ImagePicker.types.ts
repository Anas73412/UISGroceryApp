export type ImagePickerMode = 'single' | 'multiple';
export type PickedImageAsset = {
  uri: string;
  type?: string;
  width?: number;
  height?: number;
  fileName?: string;
  fileSize?: number;
};

export type ImageSourcePickerSheetProps = {
  visible: boolean;
  onRequestClose: () => void;
  onPick: (assets: PickedImageAsset[]) => void;
  mode?: ImagePickerMode;
  maxFiles?: number;
  title?: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  onError?: (message: string) => void;
};
