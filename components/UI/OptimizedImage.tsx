import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View, ActivityIndicator } from 'react-native';
import { ImageOptimizer } from '@/utils/imageOptimizer';
import Theme from '@/constants/Theme';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string } | number;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  showPlaceholder?: boolean;
}

export default function OptimizedImage({
  source,
  width,
  height,
  quality,
  format,
  showPlaceholder = true,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(showPlaceholder);

  // Only optimize URI sources
  if (typeof source === 'number') {
    return <Image source={source} style={style} {...props} />;
  }

  const { uri } = source;
  
  // Get optimized image URL
  const optimizedUri = ImageOptimizer.getOptimizedImageUrl(uri, {
    width,
    height,
    quality,
    format
  });
  
  // Get placeholder for lazy loading
  const placeholderUri = showPlaceholder ? ImageOptimizer.getPlaceholderUrl(uri) : undefined;

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <View style={[styles.placeholderContainer, StyleSheet.absoluteFill]}>
          {placeholderUri ? (
            <Image
              source={{ uri: placeholderUri }}
              style={StyleSheet.absoluteFill}
              blurRadius={5}
            />
          ) : (
            <ActivityIndicator 
              size="small" 
              color={Theme.colors.primary.blue} 
              style={styles.loader}
            />
          )}
        </View>
      )}
      
      <Image
        source={{ uri: optimizedUri }}
        style={[
          styles.image,
          isLoading && styles.loadingImage
        ]}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Theme.colors.background.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingImage: {
    opacity: 0,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
  }
});