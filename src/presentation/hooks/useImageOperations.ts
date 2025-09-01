import { Image } from '@/domain/entities/Image';
import {
  clearAllImages,
  clearError,
  deleteImage,
  saveImage,
} from '@/redux/reducers/imageReducer';
import { AppDispatch, RootState } from '@/redux/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useImageOperations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const { savedImages, errors } = useSelector(
    (state: RootState) => state.images,
  );

  const saveImageMutation = useMutation({
    mutationFn: async (image: Image) => {
      const result = await dispatch(saveImage(image)).unwrap();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['image-list'] });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await dispatch(deleteImage(id)).unwrap();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['image-list'] });
    },
  });

  const clearAllImagesMutation = useMutation({
    mutationFn: async () => {
      const result = await dispatch(clearAllImages()).unwrap();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['image-list'] });
    },
  });

  const saveImageHandler = useCallback(
    async (image: Image) => {
      try {
        await saveImageMutation.mutateAsync(image);
      } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        throw error;
      }
    },
    [saveImageMutation],
  );

  const deleteImageHandler = useCallback(
    async (id: string) => {
      try {
        await deleteImageMutation.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        throw error;
      }
    },
    [deleteImageMutation],
  );

  const clearAllImagesHandler = useCallback(async () => {
    try {
      await clearAllImagesMutation.mutateAsync();
    } catch (error) {
      console.error('Erro ao limpar todas as imagens:', error);
      throw error;
    }
  }, [clearAllImagesMutation]);

  const clearErrorHandler = useCallback(
    (errorType: keyof typeof errors) => {
      dispatch(clearError(errorType));
    },
    [dispatch],
  );

  return {
    savedImages: savedImages || [],

    savingImage: saveImageMutation.isPending,
    deletingImage: deleteImageMutation.isPending,
    clearingAllImages: clearAllImagesMutation.isPending,

    saveImageError: errors.save,
    deleteImageError: errors.delete,
    clearAllImagesError: errors.clearAll,

    saveImage: saveImageHandler,
    deleteImage: deleteImageHandler,
    clearAllImages: clearAllImagesHandler,
    clearError: clearErrorHandler,
  };
};
