export interface RNFSInterface {
  DocumentDirectoryPath: string;
  exists: (path: string) => Promise<boolean>;
  mkdir: (path: string) => Promise<void>;
  downloadFile: (options: { fromUrl: string; toFile: string }) => {
    promise: Promise<{ statusCode: number }>;
  };
  readdir: (path: string) => Promise<string[]>;
  unlink: (path: string) => Promise<void>;
}

export interface DownloadOptions {
  fromUrl: string;
  toFile: string;
}

export interface DownloadResult {
  statusCode: number;
}

export interface ImageQueryParams {
  page?: number;
  limit?: number;
}

export interface ImageListResponse {
  images: any[];
  hasMore: boolean;
  nextPage?: number;
}
