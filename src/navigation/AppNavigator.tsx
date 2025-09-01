import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { Image } from '../domain/entities/Image';
import GalleryScreen from '../screens/GalleryScreen';
import HomeScreen from '../screens/HomeScreen';
import ImageDetailScreen from '../screens/ImageDetailScreen';
import SavedImagesScreen from '../screens/SavedImagesScreen';

export type RootStackParamList = {
  Home: undefined;
  Gallery: undefined;
  Saved: undefined;
  ImageDetail: { image: Image };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Início' }}
        />
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ title: 'Galeria' }}
        />
        <Stack.Screen
          name="Saved"
          component={SavedImagesScreen}
          options={{ title: 'Imagens Salvas' }}
        />
        <Stack.Screen
          name="ImageDetail"
          component={ImageDetailScreen}
          options={{ title: 'Detalhe da Imagem' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
