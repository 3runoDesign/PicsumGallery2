import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ImageWithLocalSupport } from '../presentation/components/ImageWithLocalSupport';
import { useImageHistory } from '../presentation/hooks/useImageHistory';
import { useImageOperations } from '../presentation/hooks/useImageOperations';
import { useRandomImage } from '../presentation/hooks/useRandomImage';
import { ReactotronHelpers } from '../utils/reactotronHelpers';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { savedImages, saveImage, savingImage } = useImageOperations();

  const {
    randomImage,
    isLoading: loadingRandomImage,
    refetch: refreshRandomImage,
  } = useRandomImage();

  const { addImage, goToPrevious, getCurrentImage, canGoBack } =
    useImageHistory();

  const [_imageLoading, setImageLoading] = useState(false);

  const savedImagesSet = useMemo(() => {
    return new Set(savedImages.map(img => img.id));
  }, [savedImages]);

  const isCurrentImageSaved = useCallback(() => {
    const current = getCurrentImage();
    if (!current) return false;
    return savedImagesSet.has(current.id);
  }, [savedImagesSet, getCurrentImage]);

  useEffect(() => {
    if (randomImage) {
      addImage(randomImage);
      setImageLoading(true);
    }
  }, [randomImage, addImage]);

  useEffect(() => {
    ReactotronHelpers.log('HomeScreen montado', {
      savedImagesCount: savedImages.length,
      hasRandomImage: !!randomImage,
    });
  }, [savedImages.length, randomImage]);

  useEffect(() => {
    ReactotronHelpers.log('Estado das imagens salvas atualizado', {
      count: savedImages.length,
      images: savedImages.map(img => ({ id: img.id, author: img.author })),
    });
  }, [savedImages]);

  const currentImage = getCurrentImage();
  const currentImageIsSaved = isCurrentImageSaved();

  const handleGoBack = useCallback(() => {
    ReactotronHelpers.log('Navegando para imagem anterior');
    goToPrevious();
  }, [goToPrevious]);

  const handleNewImage = useCallback(() => {
    ReactotronHelpers.log('Solicitando nova imagem aleatória');
    refreshRandomImage();
  }, [refreshRandomImage]);

  const handleSaveImage = useCallback(async () => {
    if (!currentImage) return;

    ReactotronHelpers.log('Iniciando salvamento de imagem', {
      imageId: currentImage.id,
      author: currentImage.author,
    });

    try {
      await saveImage(currentImage);
      ReactotronHelpers.log('Imagem salva com sucesso', {
        imageId: currentImage.id,
      });
    } catch (error) {
      ReactotronHelpers.error('Erro ao salvar imagem', {
        imageId: currentImage.id,
        error: error,
      });
    }
  }, [currentImage, saveImage]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageLoadStart = useCallback(() => {
    setImageLoading(true);
  }, []);

  const handleGalleryPress = useCallback(() => {
    navigation.navigate('Gallery');
  }, [navigation]);

  const handleSavedPress = useCallback(() => {
    navigation.navigate('Saved');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Galeria</Text>

      <View style={styles.imageContainer}>
        {loadingRandomImage ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Carregando nova imagem...</Text>
          </View>
        ) : currentImage ? (
          <View style={styles.imageWrapper}>
            <ImageWithLocalSupport
              image={currentImage}
              style={styles.image}
              onLoadStart={handleImageLoadStart}
              onLoad={handleImageLoad}
              onLoadEnd={handleImageLoad}
            />

            <Pressable
              style={[
                styles.saveButton,
                currentImageIsSaved && styles.savedButton,
                savingImage && styles.savingButton,
              ]}
              onPress={handleSaveImage}
              disabled={currentImageIsSaved || savingImage}
            >
              <Text
                style={[
                  styles.saveButtonText,
                  currentImageIsSaved && styles.savedButtonText,
                  savingImage && styles.savingButtonText,
                ]}
              >
                {savingImage
                  ? 'Salvando...'
                  : currentImageIsSaved
                  ? '✓ Salva'
                  : 'Salvar Imagem'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.noImageText}>Nenhuma imagem carregada</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Nova Imagem"
          onPress={handleNewImage}
          disabled={loadingRandomImage}
        />

        <Button
          title="Imagem Anterior"
          onPress={handleGoBack}
          disabled={!canGoBack}
        />
      </View>

      <Text style={styles.counter}>Imagens Salvas: {savedImages.length}</Text>

      <View style={styles.navigationContainer}>
        <Pressable style={styles.navButton} onPress={handleGalleryPress}>
          <Text style={styles.navButtonText}>Ver Galeria</Text>
        </Pressable>

        <Pressable style={styles.navButton} onPress={handleSavedPress}>
          <Text style={styles.navButtonText}>Imagens Salvas</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: 300,
    height: 200,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 8,
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: '#4CAF50',
  },
  savingButton: {
    backgroundColor: '#FF9500',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  savedButtonText: {
    color: '#fff',
  },
  savingButtonText: {
    color: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  noImageText: {
    color: '#666',
    fontSize: 16,
  },
  buttonContainer: {
    gap: 10,
    width: '100%',
    maxWidth: 300,
  },
  counter: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
