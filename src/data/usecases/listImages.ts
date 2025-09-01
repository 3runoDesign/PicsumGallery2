import { Image } from '../../domain/entities/Image';
import { ImageStorageRepository } from '../../domain/repositories/imageStorageRepository';

export class ListSavedImagesUseCase {
  constructor(private imageStorageRepo: ImageStorageRepository) {}

  async execute(): Promise<Image[]> {
    return this.imageStorageRepo.getSavedImages();
  }
}
