import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Image } from '../domain/entities/Image';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SavedImageGrid } from '../presentation/components/SavedImageGrid';
import { useImageOperations } from '../presentation/hooks/useImageOperations';

interface ClearAllButtonProps {
  onPress: () => void;
  isClearing: boolean;
  hasImages: boolean;
}

const ClearAllButton: React.FC<ClearAllButtonProps> = ({
  onPress,
  isClearing,
  hasImages,
}) => {
  const isDisabled = isClearing || !hasImages;

  return (
    <Pressable
      style={[styles.headerButton, isDisabled && styles.headerButtonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text
        style={[
          styles.headerButtonText,
          isDisabled && styles.headerButtonTextDisabled,
        ]}
      >
        {isClearing ? 'Limpando...' : 'Limpar Tudo'}
      </Text>
    </Pressable>
  );
};

type SavedImagesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Saved'
>;

export default function SavedImagesScreen() {
  const {
    savedImages,
    deleteImage,
    deletingImage,
    clearAllImages,
    clearingAllImages,
  } = useImageOperations();
  const navigation = useNavigation<SavedImagesScreenNavigationProp>();

  const handleClearAllImages = useCallback(() => {
    clearAllImages();
  }, [clearAllImages]);

  const renderHeaderRight = useCallback(
    () => (
      <ClearAllButton
        onPress={handleClearAllImages}
        isClearing={clearingAllImages}
        hasImages={savedImages.length > 0}
      />
    ),
    [handleClearAllImages, clearingAllImages, savedImages.length],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  const handleImagePress = useCallback(
    (image: Image) => {
      navigation.navigate('ImageDetail', { image });
    },
    [navigation],
  );

  const handleDeleteImage = useCallback(
    async (image: Image) => {
      try {
        await deleteImage(image.id);
      } catch {}
    },
    [deleteImage],
  );

  if (savedImages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma imagem salva ainda.</Text>
        <Text style={styles.emptySubtext}>
          Volte à tela inicial para salvar algumas imagens!
        </Text>
      </View>
    );
  }

  return (
    <SavedImageGrid
      images={savedImages}
      onImagePress={handleImagePress}
      onDeleteImage={handleDeleteImage}
      isDeleting={deletingImage}
    />
  );
}

const styles = StyleSheet.create({
  headerButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  headerButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  headerButtonTextDisabled: {
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
