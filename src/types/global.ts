export type LoadingStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextPage?: number;
}

export interface ErrorState {
  message: string | null;
  code?: string | number;
}

export type RootStackParamList = {
  Home: undefined;
  Gallery: undefined;
  Saved: undefined;
  ImageDetail: { image: any };
};
