import { Image } from '@/domain/entities/Image';
import { LoadingStatus } from '@/types/global';

export interface ImageState {
  savedImages: Image[];
  status: {
    save: LoadingStatus;
    delete: LoadingStatus;
    clearAll: LoadingStatus;
  };
  errors: {
    save: string | null;
    delete: string | null;
    clearAll: string | null;
  };
}

export interface ActionWithType {
  type: string;
  payload?: unknown;
}

export interface FileCleanupAction extends ActionWithType {
  type: 'images/deleteImage/fulfilled' | 'images/clearAllImages/fulfilled';
  payload: string | undefined;
}
