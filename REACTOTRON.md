# 🚀 Reactotron - Configuração e Uso

## 📋 O que é o Reactotron?

O Reactotron é uma ferramenta de debug para aplicações React Native que permite:

- 🔍 Monitorar o estado do Redux em tempo real
- 📊 Visualizar ações e mudanças de estado
- 🐛 Debug de erros e logs
- 📱 Inspecionar requisições de rede
- ⚡ Monitorar performance

## 🛠️ Configuração Implementada

### 1. Dependências Instaladas

```bash
yarn add reactotron-react-native reactotron-redux
```

### 2. Arquivos Criados/Modificados

#### `src/config/ReactotronConfig.ts`

- Configuração principal do Reactotron
- Integração com Redux
- Configurações para desenvolvimento

#### `src/redux/store.ts`

- Integração do enhancer do Reactotron
- Monitoramento automático do Redux

#### `App.tsx`

- Inicialização do Reactotron
- Limpeza automática em hot reload

#### `babel.config.js`

- Configuração padrão do Babel (plugin do Reactotron não é necessário)

#### `src/utils/reactotronHelpers.ts`

- Helpers para facilitar o uso do Reactotron

## 🚀 Como Usar

### 1. Instalar o Reactotron Desktop

```bash
# macOS
brew install --cask reactotron

# Ou baixar de: https://github.com/infinitered/reactotron/releases
```

### 2. Executar o App

```bash
# iOS
yarn ios

# Android
yarn android
```

### 3. Conectar no Reactotron Desktop

- Abra o Reactotron Desktop
- O app deve aparecer automaticamente na lista
- Clique para conectar

## 📊 Funcionalidades Disponíveis

### Monitoramento do Redux

- ✅ Todas as ações são logadas automaticamente
- ✅ Estado atual visível em tempo real
- ✅ Diferenças de estado entre ações
- ✅ Time travel debugging

### Logs Personalizados

```typescript
import { ReactotronHelpers } from '@/utils/reactotronHelpers';

// Log simples
ReactotronHelpers.log('Usuário logado', { userId: 123 });

// Log de erro
ReactotronHelpers.error('Erro ao carregar dados', error);

// Display de dados
ReactotronHelpers.display({
  name: 'Estado do Redux',
  value: store.getState(),
});

// Benchmark de performance
const benchmark = ReactotronHelpers.benchmark('Carregar Imagens');
// ... código ...
benchmark.stop();
```

### Monitoramento de Rede

- ✅ Requisições HTTP automáticas
- ✅ Headers e body das requisições
- ✅ Tempo de resposta
- ✅ Status codes

## 🔧 Configurações Avançadas

### Para Android Emulator

No arquivo `src/config/ReactotronConfig.ts`, altere:

```typescript
host: '10.0.2.2', // Para Android Emulator
```

### Para Dispositivo Físico

```typescript
host: '192.168.1.100', // IP da sua máquina na rede local
```

## 🎯 Exemplos de Uso no Projeto

### Debug de Ações Redux

```typescript
// No reducer, você pode ver automaticamente:
// - Ação disparada
// - Estado anterior
// - Estado novo
// - Diferenças
```

### Debug de Use Cases

```typescript
// Adicione logs nos use cases:
export class SaveImageUseCase {
  async execute(image: Image): Promise<void> {
    ReactotronHelpers.log('Salvando imagem', { imageId: image.id });

    try {
      await this.imageStorageRepo.saveImage(image);
      ReactotronHelpers.log('Imagem salva com sucesso');
    } catch (error) {
      ReactotronHelpers.error('Erro ao salvar imagem', error);
      throw error;
    }
  }
}
```

### Debug de Componentes

```typescript
// Em componentes React:
useEffect(() => {
  ReactotronHelpers.log('Componente montado', {
    componentName: 'HomeScreen',
    props: { userId: user.id },
  });
}, []);
```

## 🚨 Troubleshooting

### App não aparece no Reactotron

1. Verifique se o Reactotron Desktop está rodando
2. Confirme se o host está correto
3. Reinicie o Metro bundler: `yarn start --reset-cache`

### Erros de conexão

1. Verifique o firewall
2. Confirme se a porta 9090 está livre
3. Para Android, use `10.0.2.2` como host

### Performance

- O Reactotron só funciona em modo desenvolvimento (`__DEV__`)
- Em produção, não há overhead de performance

## 📚 Recursos Adicionais

- [Documentação Oficial](https://github.com/infinitered/reactotron)
- [Reactotron Redux](https://github.com/infinitered/reactotron/tree/master/packages/reactotron-redux)
- [Reactotron React Native](https://github.com/infinitered/reactotron/tree/master/packages/reactotron-react-native)

## 🎉 Pronto!

Agora você pode:

- ✅ Monitorar todas as ações do Redux
- ✅ Debug de erros em tempo real
- ✅ Inspecionar requisições de rede
- ✅ Usar logs personalizados
- ✅ Monitorar performance

O Reactotron está totalmente configurado e pronto para uso! 🚀
