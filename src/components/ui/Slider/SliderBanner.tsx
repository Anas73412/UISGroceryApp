import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { SliderModel } from '../../../data/models/SliderModel';
import { IMAGE_BASE_URL } from '../../../utils/constants';
import { theme } from '../../../theme';
import { RemoteImage } from '../RemoteImage/RemoteImage';

const SLIDER_HEIGHT = 160;
type SliderBannerProps = {
  slider: SliderModel;
  baseUrl?: string;
  itemWidth?: number;
};
export function SliderBanner({
  slider,
  baseUrl = IMAGE_BASE_URL,
  itemWidth = Dimensions.get('window').width,
}: SliderBannerProps) {
  const imageUri = slider.image_path.startsWith('http')
    ? slider.image_path
    : `${baseUrl}${slider.image_path}`;
  return (
    <View style={[styles.slide, { width: itemWidth }]}>
      <RemoteImage uri={imageUri} style={styles.image} resizeMode="cover" />
    </View>
  );
}
const styles = StyleSheet.create({
  slide: {
    height: SLIDER_HEIGHT,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
