import { Image } from '@/domain/entities/Image';
import { RNFSInterface } from './types';

let RNFS: RNFSInterface | null = null;

export class ImageDownloadService {
  private static async initRNFS(): Promise<RNFSInterface> {
    if (RNFS) {
      console.log('RNFS :: já inicializado');
      return RNFS;
    }

    try {
      console.log('Tentando carregar react-native-fs...');

      RNFS = require('react-native-fs');

      if (!RNFS) {
        throw new Error('RNFS :: null ou undefined após require');
      }

      console.log('react-native-fs carregado com sucesso');
      console.log('RNFS type:', typeof RNFS);
      console.log('RNFS properties:', Object.keys(RNFS || {}));

      if (RNFS.DocumentDirectoryPath) {
        console.log('DocumentDirectoryPath:', RNFS.DocumentDirectoryPath);
      } else {
        console.warn('DocumentDirectoryPath não está disponível');
      }

      return RNFS;
    } catch (error) {
      console.error('Falha ao carregar react-native-fs:', error);

      try {
        console.log('Tentando acesso direto às funções...');
        const testModule = require('react-native-fs');
        console.log('Módulo carregado, testando funcionalidades...');

        if (testModule && typeof testModule.exists === 'function') {
          RNFS = testModule as RNFSInterface;
          return RNFS;
        } else {
          throw new Error('Funções do RNFS não estão disponíveis');
        }
      } catch (secondError) {
        console.error('Segunda tentativa também falhou:', secondError);
        throw new Error('Sistema de arquivos não disponível');
      }
    }
  }

  private static async getImagesDir(): Promise<string> {
    const rnfs = await this.initRNFS();
    return `${rnfs.DocumentDirectoryPath}/images/`;
  }

  private static async isRNFSAvailable(): Promise<boolean> {
    try {
      const rnfs = await this.initRNFS();
      const isAvailable =
        !!rnfs &&
        !!rnfs.DocumentDirectoryPath &&
        typeof rnfs.exists === 'function';

      console.log('Verificação do RNFS:', {
        rnfs: !!rnfs,
        DocumentDirectoryPath: !!rnfs?.DocumentDirectoryPath,
        existsFunction: typeof rnfs?.exists,
        actualPath: rnfs?.DocumentDirectoryPath,
        isAvailable,
      });

      return isAvailable;
    } catch (error) {
      console.warn('RNFS não está disponível:', error);
      return false;
    }
  }

  private static async ensureImagesDirectory(): Promise<void> {
    if (!(await this.isRNFSAvailable())) {
      throw new Error('Sistema de arquivos não disponível');
    }

    const rnfs = await this.initRNFS();
    const imagesDir = await this.getImagesDir();
    const dirExists = await rnfs.exists(imagesDir);
    if (!dirExists) {
      await rnfs.mkdir(imagesDir);
    }
  }

  static async downloadAndSaveImage(image: Image): Promise<string> {
    try {
      console.log(`Iniciando download da imagem ${image.id}...`);

      if (!(await this.isRNFSAvailable())) {
        console.warn('RNFS não disponível, usando fallback');

        return image.url;
      }

      await this.ensureImagesDirectory();

      const rnfs = await this.initRNFS();
      const fileExtension = this.getFileExtension(image.url);
      const fileName = `${image.id}${fileExtension}`;
      const imagesDir = await this.getImagesDir();
      const localPath = `${imagesDir}${fileName}`;

      console.log(`Baixando de ${image.url} para ${localPath}`);

      const options = {
        fromUrl: image.url,
        toFile: localPath,
      };

      const downloadResult = await rnfs.downloadFile(options).promise;

      if (downloadResult.statusCode === 200) {
        console.log(`Download concluído com sucesso: ${localPath}`);
        return localPath;
      } else {
        throw new Error(
          `Falha ao baixar imagem. Status: ${downloadResult.statusCode}`,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      console.warn('Erro ao baixar imagem localmente:', errorMessage);

      console.log('Usando URL original como fallback');
      return image.url;
    }
  }

  static async getLocalImagePath(imageId: string): Promise<string | null> {
    try {
      if (!(await this.isRNFSAvailable())) {
        return null;
      }

      await this.ensureImagesDirectory();
      const rnfs = await this.initRNFS();
      const imagesDir = await this.getImagesDir();
      const files = await rnfs.readdir(imagesDir);
      const matchingFile = files.find((file: string) =>
        file.startsWith(imageId),
      );

      if (matchingFile) {
        return `${imagesDir}${matchingFile}`;
      }

      return null;
    } catch (error) {
      console.error(`Erro ao verificar imagem local ${imageId}:`, error);
      return null;
    }
  }

  static async deleteLocalImage(localPath: string): Promise<void> {
    try {
      console.log(
        'ImageDownloadService :: Tentando deletar arquivo:',
        localPath,
      );

      if (!(await this.isRNFSAvailable())) {
        console.warn(
          'ImageDownloadService :: RNFS não disponível, cancelando deleção',
        );
        return;
      }

      const rnfs = await this.initRNFS();
      const fileExists = await rnfs.exists(localPath);
      console.log(
        'ImageDownloadService :: Arquivo existe?',
        fileExists,
        'Path:',
        localPath,
      );

      if (fileExists) {
        await rnfs.unlink(localPath);
        console.log(
          'ImageDownloadService :: Arquivo deletado com sucesso:',
          localPath,
        );
      } else {
        console.log(
          'ImageDownloadService :: Arquivo não existe, nada para deletar:',
          localPath,
        );
      }
    } catch (error) {
      console.error(
        `ImageDownloadService :: Erro ao remover imagem local ${localPath}:`,
        error,
      );
    }
  }

  private static getFileExtension(url: string): string {
    try {
      const extension = url.split('.').pop();
      return extension &&
        ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension.toLowerCase())
        ? `.${extension.toLowerCase()}`
        : '.jpg';
    } catch {
      return '.jpg';
    }
  }

  static async clearAllLocalImages(): Promise<void> {
    try {
      if (!(await this.isRNFSAvailable())) {
        return;
      }

      const rnfs = await this.initRNFS();
      const imagesDir = await this.getImagesDir();
      const dirExists = await rnfs.exists(imagesDir);
      if (dirExists) {
        await rnfs.unlink(imagesDir);
      }
    } catch (error) {
      console.error('Erro ao limpar imagens locais:', error);
    }
  }
}
