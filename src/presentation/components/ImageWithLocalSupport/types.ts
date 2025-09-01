import { Image } from '@/domain/entities/Image';
import { ImageProps } from 'react-native';

export interface ImageWithLocalSupportProps extends Omit<ImageProps, 'source'> {
  image: Image;
  style?: ImageProps['style'];
  onLoadStart?: () => void;
  onLoad?: () => void;
  onLoadEnd?: () => void;
}
