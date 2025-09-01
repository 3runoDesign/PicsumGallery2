# PicsumGallery

Um app RN para navegar e salvar imagens da API do Picsum. O app permite visualizar imagens aleatórias, navegar por uma galeria completa e salvar suas imagens favoritas localmente.

## 📱 Sobre o app

O PicsumGallery é um app de galeria de imagens que oferece:

- **Tela Inicial**: Visualização de imagens aleatórias com histórico de navegação
- **Galeria**: Browse completo de imagens com paginação infinita
- **Imagens Salvas**: Visualização das imagens salvadas localmente
- **Detalhes**: Tela detalhada de cada imagem com informações do autor

### Funcionalidades Principais

- ✅ Carregamento de imagens aleatórias
- ✅ Navegação entre imagens (anterior/próxima)
- ✅ Salvamento local de imagens favoritas
- ✅ Galeria com scroll infinito
- ✅ Suporte a imagens offline
- ✅ Interface intuitiva e responsiva

## 🛠 Tecnologias Utilizadas

- **React Native 0.81.1 (com TypeScript)** - Framework principal
- **React Navigation** - Navegação entre telas
- **React Query (TanStack Query)** - Gerenciamento de estado e cache
- **Redux** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para requisições
- **AsyncStorage** - Persistência de dados local
- **React Native FS** - Sistema de arquivos

## 📋 Pré-requisitos

Antes de executar o app, certifique-se de ter o ambiente React Native configurado. Siga o guia oficial: [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)

### Versões Necessárias

- **Node.js**: >= 20.0.0
- **Yarn**: >= 1.22.0 (recomendado) ou npm
- **Ruby**: Para dependências do iOS (Bundler e CocoaPods)
- **Xcode**: Versão mais recente (para iOS)

## 🚀 Como Executar o app

### 2. Instalar Dependências

```bash
# Instalar dependências JavaScript
yarn install

# Para iOS: Instalar dependências Ruby e CocoaPods
cd ios && pod install && cd ..
```

### 3. Executar o app

#### Iniciar o Metro Bundler

Em um terminal, execute:

```bash
yarn start
```

#### Executar no iOS

Em outro terminal:

```bash
# Executar no simulador padrão
yarn ios

# Executar em um simulador específico
yarn ios --simulator="iPhone 15 Pro"

# Executar em dispositivo físico
yarn ios --device
```
