import { ImageProps } from 'react-native';

export interface CustomImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string };
  style?: ImageProps['style'];
  onPress?: () => void;
}
