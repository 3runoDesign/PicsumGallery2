import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

// Configuração do Reactotron
const reactotron = Reactotron.configure({
  name: 'PicsumGallery',
  host: 'localhost', // Para iOS Simulator
  // host: '10.0.2.2', // Para Android Emulator
})
  .use(reactotronRedux())
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: stackFrame => false },
    overlay: false,
  })
  .connect();

// Limpar timeline no hot reload
if (__DEV__) {
  reactotron.clear?.();
}

export default reactotron;
