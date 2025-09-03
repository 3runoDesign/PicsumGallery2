import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import reactotron from './src/config/ReactotronConfig';
import { DependencyProvider } from './src/core/dependenciesContext';
import { queryClient } from './src/core/queryClient';
import AppNavigator from './src/navigation/AppNavigator';
import { persistor, store } from './src/redux/store';

const App = () => {
  // Inicializar Reactotron apenas em desenvolvimento
  if (__DEV__) {
    reactotron.clear?.();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={<Text>Carregando...</Text>} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <DependencyProvider>
              <AppNavigator />
            </DependencyProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
