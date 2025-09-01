import { Image } from '@/domain/entities/Image';

export interface SavedImageGridProps {
  images: Image[];
  onImagePress?: (image: Image) => void;
  onDeleteImage?: (image: Image) => void;
  isDeleting?: boolean;
}
