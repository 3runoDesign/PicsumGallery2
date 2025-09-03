import { ClearAllImagesUseCase } from '@/data/usecases/clearAllImages';
import { DeleteImageUseCase } from '@/data/usecases/deleteImage';
import { ListSavedImagesUseCase } from '@/data/usecases/listImages';
import { SaveImageUseCase } from '@/data/usecases/saveImage';
import { Image } from '@/domain/entities/Image';
import { ImageDownloadService } from '@/services/imageDownloadService';
import { ReactotronHelpers } from '@/utils/reactotronHelpers';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ImageState } from '../types';

const initialState: ImageState = {
  savedImages: [],
  status: {
    save: 'idle',
    delete: 'idle',
    clearAll: 'idle',
    list: 'idle',
  },
  errors: {
    save: null,
    delete: null,
    clearAll: null,
    list: null,
  },
};

export const saveImage = createAsyncThunk(
  'images/saveImage',
  async (image: Image, { extra }) => {
    const { saveUseCase } = extra as {
      saveUseCase: SaveImageUseCase;
    };

    await saveUseCase.execute(image);

    const localPath = await ImageDownloadService.getLocalImagePath(image.id);

    const savedImage: Image = localPath ? { ...image, localPath } : image;

    console.log('SaveImage thunk :: Imagem salva com localPath?', {
      imageId: image.id,
      originalLocalPath: image.localPath,
      foundLocalPath: localPath,
      finalLocalPath: savedImage.localPath,
    });

    return savedImage;
  },
);

export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async (id: string, { extra }) => {
    const { deleteUseCase } = extra as {
      deleteUseCase: DeleteImageUseCase;
    };

    ReactotronHelpers.log('HUUUUM', id);

    await deleteUseCase.execute(id);
    return id;
  },
);

export const clearAllImages = createAsyncThunk(
  'images/clearAllImages',
  async (_, { extra }) => {
    const { clearAllUseCase } = extra as {
      clearAllUseCase: ClearAllImagesUseCase;
    };

    await clearAllUseCase.execute();
  },
);

export const listImages = createAsyncThunk(
  'images/listImages',
  async (_, { extra }) => {
    const { listUseCase } = extra as {
      listUseCase: ListSavedImagesUseCase;
    };

    return await listUseCase.execute();
  },
);

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearError: (state, action) => {
      const errorType = action.payload as keyof typeof state.errors;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },

    clearAllErrors: state => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key as keyof typeof state.errors] = null;
      });
    },

    resetOperationStatus: (state, action) => {
      const operation = action.payload as keyof typeof state.status;
      if (operation && state.status[operation]) {
        state.status[operation] = 'idle';
        state.errors[operation] = null;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(saveImage.pending, state => {
        state.status.save = 'pending';
        state.errors.save = null;
      })
      .addCase(saveImage.fulfilled, (state, action) => {
        console.log('Reducer :: saveImage.fulfilled executado', {
          imageId: action.payload.id,
          hasLocalPath: !!action.payload.localPath,
          localPath: action.payload.localPath,
        });
        state.status.save = 'succeeded';
        state.savedImages.push(action.payload);
      })
      .addCase(saveImage.rejected, (state, action) => {
        state.status.save = 'failed';
        state.errors.save = action.error.message || 'Erro ao salvar imagem';
      });

    builder
      .addCase(deleteImage.pending, state => {
        ReactotronHelpers.log('huuum1 pending');
        state.status.delete = 'pending';
        state.errors.delete = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        console.log('Reducer :: deleteImage.fulfilled executado', {
          imageId: action.payload,
          imagesBefore: state.savedImages.length,
        });
        state.status.delete = 'succeeded';
        state.savedImages = state.savedImages.filter(
          img => img.id !== action.payload,
        );
        console.log(
          'Reducer :: Imagens após remoção:',
          state.savedImages.length,
        );
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.status.delete = 'failed';
        state.errors.delete = action.error.message || 'Erro ao deletar imagem';
      });

    builder
      .addCase(clearAllImages.pending, state => {
        state.status.clearAll = 'pending';
        state.errors.clearAll = null;
      })
      .addCase(clearAllImages.fulfilled, state => {
        state.status.clearAll = 'succeeded';
        state.savedImages = [];
      })
      .addCase(clearAllImages.rejected, (state, action) => {
        state.status.clearAll = 'failed';
        state.errors.clearAll =
          action.error.message || 'Erro ao limpar imagens';
      });

    builder
      .addCase(listImages.pending, state => {
        state.status.list = 'pending';
        state.errors.list = null;
      })
      .addCase(listImages.fulfilled, (state, action) => {
        state.status.list = 'succeeded';
        state.savedImages = action.payload;
      })
      .addCase(listImages.rejected, (state, action) => {
        state.status.list = 'failed';
        state.errors.list = action.error.message || 'Erro ao listar imagens';
      });
  },
});

export const { clearError, clearAllErrors, resetOperationStatus } =
  imageSlice.actions;

export default imageSlice.reducer;
