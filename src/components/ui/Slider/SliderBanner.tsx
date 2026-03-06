import React, { useState } from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SliderModel } from '../../../data/models/SliderModel';
import { IMAGE_BASE_URL } from '../../../utils/constants';
import { theme } from '../../../theme';

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
  const [isLoading, setIsLoading] = useState(true);
  const imageUri = slider.image_path.startsWith('http')
    ? slider.image_path
    : `${baseUrl}${slider.image_path}`;
  return (
    <View style={[styles.slide, { width: itemWidth }]}>
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
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
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
