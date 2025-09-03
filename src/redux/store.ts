import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import reactotron from '../config/ReactotronConfig';
import { fileCleanupMiddleware } from './middleware/fileCleanupMiddleware';
import imageReducer from './reducers/imageReducer';

import {
  clearAllUseCase,
  deleteUseCase,
  listUseCase,
  saveUseCase,
} from '@/core/dependenciesContext';

const persistConfig = {
  key: 'images',
  storage: AsyncStorage,
  whitelist: ['savedImages'],
};

const persistedImageReducer = persistReducer(persistConfig, imageReducer);

type RootState = {
  images: ReturnType<typeof persistedImageReducer>;
};

export const store = configureStore({
  reducer: {
    images: persistedImageReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          listUseCase,
          saveUseCase,
          deleteUseCase,
          clearAllUseCase,
        },
      },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(fileCleanupMiddleware),
  enhancers: getDefaultEnhancers => {
    const enhancers = getDefaultEnhancers();
    if (__DEV__) {
      enhancers.push(reactotron.createEnhancer());
    }
    return enhancers;
  },
});

export const persistor = persistStore(store);

export type { RootState };
export type AppDispatch = typeof store.dispatch;
