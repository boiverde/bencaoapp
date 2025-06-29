# Bênção Match

Um aplicativo de conexões cristãs para encontrar amizades e relacionamentos baseados na fé.

## Sobre o Projeto

Bênção Match é um aplicativo de relacionamento focado na comunidade cristã, que permite aos usuários:

- Encontrar conexões baseadas em compatibilidade espiritual e valores
- Comunicar-se de forma segura através de chat
- Participar de eventos e grupos da comunidade
- Compartilhar momentos de oração e versículos
- Construir relacionamentos saudáveis baseados na fé

## Tecnologias

- React Native
- Expo
- TypeScript
- Expo Router
- RevenueCat (para compras in-app)

## Funcionalidades Principais

- Sistema de perfis e matching
- Chat com recursos espirituais
- Comunidade e eventos
- Recursos de oração e devocionais
- Sistema de monetização com assinaturas e compras in-app

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm run dev

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar na Web
npm run web
```

## Preparação para Lojas de Aplicativos

### Configuração do RevenueCat

Para implementar compras in-app e assinaturas, é necessário:

1. Exportar o projeto do Bolt
2. Instalar o SDK do RevenueCat:
   ```bash
   npx expo install react-native-purchases expo-dev-client
   ```
3. Configurar o SDK seguindo a documentação oficial:
   https://www.revenuecat.com/docs/getting-started/installation/expo

### Builds para Lojas

```bash
# Configurar EAS
eas login
eas build:configure

# Criar build para Android
npm run build:android

# Criar build para iOS
npm run build:ios

# Enviar para as lojas
npm run submit:android
npm run submit:ios
```

## Requisitos para Publicação

### Google Play Store
- Conta de desenvolvedor ($25 taxa única)
- Política de privacidade
- Capturas de tela do aplicativo
- Ícone de alta resolução
- Descrição completa do aplicativo
- Classificação de conteúdo

### Apple App Store
- Conta de desenvolvedor ($99/ano)
- Política de privacidade
- Capturas de tela do aplicativo
- Ícone de alta resolução
- Descrição completa do aplicativo
- Informações de revisão do app

## Monetização

O aplicativo utiliza um modelo freemium com:

- Plano básico gratuito
- Assinatura premium mensal e anual
- Compras in-app para recursos específicos

## Licença

Todos os direitos reservados.