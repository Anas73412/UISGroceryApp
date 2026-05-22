import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SliderModel } from '../../../data/models/SliderModel';
import {
  AUTO_SLIDE_INTERVAL,
  SLIDER_ITEM_WIDTH,
} from '../../../utils/constants';
import { SliderBanner } from '../Slider/SliderBanner';
import { styles } from './BannerSlider.styles';

type BannerSliderProps = {
  sliders: SliderModel[];
};

export function BannerSlider({ sliders }: BannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<SliderModel>>(null);

  useEffect(() => {
    if (sliders.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % sliders.length;
        listRef.current?.scrollToOffset({
          offset: next * SLIDER_ITEM_WIDTH,
          animated: true,
        });
        return next;
      });
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [sliders.length]);

  if (sliders.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={sliders}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item.id)}
        snapToInterval={SLIDER_ITEM_WIDTH}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={e => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / SLIDER_ITEM_WIDTH,
          );
          setActiveIndex(Math.min(index, sliders.length - 1));
        }}
        renderItem={({ item }) => (
          <SliderBanner
            slider={item}
            itemWidth={SLIDER_ITEM_WIDTH}
          />
        )}
      />
      {sliders.length > 1 ? (
        <View style={styles.indicatorRow}>
          {sliders.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
