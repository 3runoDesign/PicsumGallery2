import { useEffect, useState } from 'react';
import { Image } from '../../domain/entities/Image';
import { ImageDownloadService } from '../../services/imageDownloadService';

export const useImageSource = (image: Image): string => {
  const [imageUri, setImageUri] = useState<string>(
    image.localPath || image.url,
  );

  useEffect(() => {
    const verifyAndGetImageSource = async () => {
      if (image.localPath) {
        try {
          const localExists = await ImageDownloadService.getLocalImagePath(
            image.id,
          );

          if (localExists && localExists === image.localPath) {
            setImageUri(image.localPath);
          } else {
            console.warn(
              `Arquivo local não encontrado para imagem ${image.id}, usando URL remota`,
            );
            setImageUri(image.url);
          }
        } catch (error) {
          console.warn(
            `Erro ao verificar arquivo local para imagem ${image.id}:`,
            error,
          );
          setImageUri(image.url);
        }
      } else {
        setImageUri(image.url);
      }
    };

    verifyAndGetImageSource();
  }, [image.id, image.localPath, image.url]);

  return imageUri;
};
