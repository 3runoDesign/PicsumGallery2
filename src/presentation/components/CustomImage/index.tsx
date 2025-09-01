import React, { memo, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { CustomImageProps } from './types';

export const CustomImage = memo<CustomImageProps>(
  ({ source, style, onPress, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoadStart = useCallback(() => {
      setIsLoading(true);
      setHasError(false);
    }, []);

    const handleLoad = useCallback(() => {
      setIsLoading(false);
    }, []);

    const handleError = useCallback(() => {
      setIsLoading(false);
      setHasError(true);
    }, []);

    const imageComponent = (
      <View style={[styles.container, style]}>
        <Image
          source={source}
          style={[styles.image, style]}
          resizeMode="cover"
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}

        {hasError && (
          <View style={styles.errorOverlay}>
            <ActivityIndicator size="small" color="#FF3B30" />
          </View>
        )}
      </View>
    );

    if (onPress) {
      return (
        <Pressable onPress={onPress} style={style}>
          {imageComponent}
        </Pressable>
      );
    }

    return imageComponent;
  },
);

CustomImage.displayName = 'CustomImage';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export type { CustomImageProps } from './types';
