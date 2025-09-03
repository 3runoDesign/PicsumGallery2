import reactotron from '../config/ReactotronConfig';

// Helpers para facilitar o uso do Reactotron
export const ReactotronHelpers = {
  // Log personalizado
  log: (message: string, data?: any) => {
    if (__DEV__) {
      reactotron.log?.(message, data);
    }
  },

  // Log de erro
  error: (message: string, error?: any) => {
    if (__DEV__) {
      reactotron.error?.(message, error);
    }
  },

  // Log de warning
  warn: (message: string, data?: any) => {
    if (__DEV__) {
      reactotron.warn?.(message, data);
    }
  },

  // Log de info
  info: (message: string, data?: any) => {
    if (__DEV__) {
      reactotron.info?.(message, data);
    }
  },

  // Log de debug
  debug: (message: string, data?: any) => {
    if (__DEV__) {
      reactotron.debug?.(message, data);
    }
  },

  // Display de imagem
  image: (uri: string, preview?: string) => {
    if (__DEV__) {
      reactotron.image?.(uri, preview);
    }
  },

  // Display de JSON
  display: (config: { name: string; value: any; preview?: string }) => {
    if (__DEV__) {
      reactotron.display?.(config);
    }
  },

  // Timeline de performance
  benchmark: (name: string) => {
    if (__DEV__) {
      return reactotron.benchmark?.(name);
    }
    return {
      step: () => {},
      stop: () => {},
    };
  },

  // Overlay de rede
  show: () => {
    if (__DEV__) {
      reactotron.show?.();
    }
  },

  // Esconder overlay
  hide: () => {
    if (__DEV__) {
      reactotron.hide?.();
    }
  },
};

// Exemplo de uso:
// ReactotronHelpers.log('Usuário logado', { userId: 123, name: 'João' });
// ReactotronHelpers.error('Erro ao carregar dados', error);
// ReactotronHelpers.display({ name: 'Estado do Redux', value: store.getState() });
