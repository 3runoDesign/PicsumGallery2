import { Image } from '../../domain/entities/Image';
import { ImageStorageRepository } from '../../domain/repositories/imageStorageRepository';
import { ImageDownloadService } from '../../services/imageDownloadService';

export class SaveImageUseCase {
  constructor(private imageStorageRepo: ImageStorageRepository) {}

  async execute(image: Image): Promise<void> {
    if (!image.id || !image.url) {
      throw new Error('Imagem inválida.');
    }

    try {
      let localPath = image.localPath;

      if (!localPath) {
        const existingLocalPath = await ImageDownloadService.getLocalImagePath(
          image.id,
        );

        if (existingLocalPath) {
          localPath = existingLocalPath;
        } else {
          try {
            const downloadedPath =
              await ImageDownloadService.downloadAndSaveImage(image);

            if (downloadedPath && downloadedPath !== image.url) {
              localPath = downloadedPath;
            }

            console.log(
              `Download resultado :: ${downloadedPath}, original: ${image.url}`,
            );
          } catch (downloadError) {
            console.warn(
              `Falha ao baixar imagem ${image.id} localmente:`,
              downloadError,
            );
          }
        }
      }

      const imageToSave: Image = localPath ? { ...image, localPath } : image;

      await this.imageStorageRepo.saveImage(imageToSave);
    } catch (error) {
      console.error(`Erro ao salvar imagem ${image.id}:`, error);

      try {
        await this.imageStorageRepo.saveImage(image);
      } catch (fallbackError) {
        console.error(
          `Erro no fallback ao salvar imagem ${image.id}:`,
          fallbackError,
        );
        throw new Error(
          `Erro crítico ao salvar imagem: ${
            fallbackError instanceof Error
              ? fallbackError.message
              : 'Erro desconhecido'
          }`,
        );
      }
    }
  }
}
