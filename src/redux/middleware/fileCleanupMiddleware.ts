import { RootState } from '@/redux/store';
import { ImageDownloadService } from '@/services/imageDownloadService';
import { Middleware } from '@reduxjs/toolkit';
import { ActionWithType } from '../types';

function isActionWithType(action: unknown): action is ActionWithType {
  return typeof action === 'object' && action !== null && 'type' in action;
}

export const fileCleanupMiddleware: Middleware<{}, RootState> =
  store => next => (action: unknown) => {
    if (!isActionWithType(action)) {
      return next(action);
    }

    let imageToDelete = null;
    if (action.type === 'images/deleteImage/fulfilled') {
      const imageId = action.payload as string;
      const state = store.getState();
      imageToDelete = state.images.savedImages.find(img => img.id === imageId);
      console.log('Middleware :: deleteImage action detected', {
        imageId,
        imageToDelete: imageToDelete
          ? {
              id: imageToDelete.id,
              localPath: imageToDelete.localPath,
              author: imageToDelete.author,
            }
          : null,
      });
    }

    let localPathsToDelete: string[] = [];
    if (action.type === 'images/clearAllImages/fulfilled') {
      const state = store.getState();
      localPathsToDelete = state.images.savedImages
        .map(img => img.localPath)
        .filter(Boolean) as string[];
    }

    const result = next(action);

    if (
      action.type === 'images/deleteImage/fulfilled' &&
      imageToDelete?.localPath
    ) {
      console.log(
        'Middleware :: Iniciando deleção de arquivo:',
        imageToDelete.localPath,
      );
      ImageDownloadService.deleteLocalImage(imageToDelete.localPath)
        .then(() => {
          console.log(
            'Middleware :: Arquivo deletado com sucesso:',
            imageToDelete.localPath,
          );
        })
        .catch(error => {
          console.error('Middleware :: Erro ao deletar arquivo local:', error);
        });
    }

    if (
      action.type === 'images/clearAllImages/fulfilled' &&
      localPathsToDelete.length > 0
    ) {
      localPathsToDelete.forEach(localPath => {
        ImageDownloadService.deleteLocalImage(localPath).catch(error => {
          console.error('Erro ao deletar arquivo local:', error);
        });
      });
    }

    return result;
  };
