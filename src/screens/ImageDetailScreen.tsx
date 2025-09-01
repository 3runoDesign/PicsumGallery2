import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Image } from '../domain/entities/Image';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CustomImage } from '../presentation/components/CustomImage';
import { useImageOperations } from '../presentation/hooks/useImageOperations';

type ImageDetailScreenRouteProp = RouteProp<RootStackParamList, 'ImageDetail'>;
type ImageDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ImageDetail'
>;

export default function ImageDetailScreen() {
  const route = useRoute<ImageDetailScreenRouteProp>();
  const navigation = useNavigation<ImageDetailScreenNavigationProp>();
  const { image } = route.params;
  const { url, id, author, width, height, localPath } = image;

  const { saveImage, savingImage, deleteImage, deletingImage, savedImages } =
    useImageOperations();

  const isImageSaved = useMemo(
    () => savedImages.some((img: Image) => img.id === id),
    [savedImages, id],
  );

  const handleSaveImage = async () => {
    try {
      await saveImage(image);
    } catch {}
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDeleteImage = async () => {
    try {
      await deleteImage(id);
      navigation.goBack();
    } catch {}
  };

  if (!url) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>URL da imagem não encontrada</Text>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.image}>
          <CustomImage
            source={{ uri: localPath || url }}
            style={styles.image}
          />
        </View>

        <View style={styles.metadataContainer}>
          <Text style={styles.metadataTitle}>Informações da Imagem</Text>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Autor:</Text>
            <Text style={styles.metadataValue}>{author}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Dimensões:</Text>
            <Text style={styles.metadataValue}>
              {width} x {height}px
            </Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>ID:</Text>
            <Text style={styles.metadataValue}>{id}</Text>
          </View>
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Status:</Text>
            <Text
              style={[
                styles.metadataValue,
                styles.statusText,
                isImageSaved
                  ? styles.savedStatusText
                  : styles.notSavedStatusText,
              ]}
            >
              {isImageSaved ? '✓ Salva' : 'Não salva'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.backButton]}
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>

        {isImageSaved ? (
          <Pressable
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteImage}
            disabled={deletingImage}
          >
            <Text style={styles.deleteButtonText}>
              {deletingImage ? 'Excluindo...' : 'Excluir Imagem'}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, styles.saveButton]}
            onPress={handleSaveImage}
            disabled={savingImage}
          >
            <Text style={styles.saveButtonText}>
              {savingImage ? 'Salvando...' : 'Salvar Imagem'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 400,
  },
  metadataContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  metadataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metadataLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  metadataValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  savedStatusText: {
    color: '#4CAF50',
  },
  notSavedStatusText: {
    color: '#FF9800',
  },
});
