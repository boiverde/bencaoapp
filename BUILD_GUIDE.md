# Guia de Build - Bênção Match

## 📋 Pré-requisitos

### 1. Ferramentas Necessárias
- Node.js 18+ instalado
- NPM ou Yarn
- Conta Expo (criar em https://expo.dev)
- Conta Google Play Console (US$ 25)

### 2. Instalação do EAS CLI
```bash
npm install -g eas-cli
```

## 🔐 Configuração Inicial

### 1. Login no Expo
```bash
eas login
```
Use suas credenciais do Expo.

### 2. Configurar o Projeto
```bash
# Navegar para o diretório do projeto
cd /caminho/para/bencao-match

# Instalar dependências
npm install

# Configurar EAS (se ainda não foi feito)
eas build:configure
```

### 3. Verificar Variáveis de Ambiente
Certifique-se que o arquivo `.env` contém:
```
EXPO_PUBLIC_SUPABASE_URL=sua_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_supabase
```

## 🏗️ Tipos de Build

### 1. Build de Desenvolvimento (APK)
Para testar em dispositivos físicos:
```bash
eas build --profile development --platform android
```

### 2. Build de Preview (APK)
Para testar versão de release sem publicar:
```bash
eas build --profile preview --platform android
```

### 3. Build de Produção (AAB)
Para publicar na Play Store:
```bash
eas build --profile production --platform android
```

## 🔑 Assinatura do App

### Opção 1: EAS Gerencia a Assinatura (Recomendado)
O EAS automaticamente cria e gerencia o keystore:
```bash
eas build --profile production --platform android
```

Quando perguntado "Would you like to generate a Keystore?", responda **YES**.

### Opção 2: Usar Seu Próprio Keystore
Se você já tem um keystore:

1. **Criar keystore manualmente**:
```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore bencao-match.keystore \
  -alias bencao-match-key \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

2. **Configurar credenciais no EAS**:
```bash
eas credentials
```

Selecione:
- Android → Production
- Set up a new keystore
- Upload seu keystore

⚠️ **IMPORTANTE**: Guarde o keystore em local seguro! Você precisa dele para todas as atualizações futuras.

## 📦 Processo de Build Completo

### Passo a Passo:

1. **Preparar o código**
```bash
# Verificar se não há erros
npm run lint

# Limpar cache se necessário
expo start -c
```

2. **Atualizar versão em app.json**
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

3. **Iniciar build de produção**
```bash
eas build --profile production --platform android
```

4. **Aguardar o build**
- Build acontece na nuvem da Expo
- Tempo médio: 10-20 minutos
- Você receberá notificação por email quando concluir

5. **Download do arquivo**
Após o build, você pode:
- Baixar pelo link no email
- Baixar pelo dashboard: https://expo.dev
- Usar comando: `eas build:download`

## 📱 Testar o Build

### Instalar APK em dispositivo Android:
```bash
# Download do APK
eas build:download --platform android --profile preview

# Transferir para o dispositivo via ADB
adb install caminho/para/app.apk
```

### Testar AAB localmente:
AAB não pode ser instalado diretamente. Use o bundletool do Google:
```bash
# Download do bundletool
wget https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar

# Gerar APK universal do AAB
java -jar bundletool-all.jar build-apks \
  --bundle=app.aab \
  --output=app.apks \
  --mode=universal

# Instalar
adb install app.apks
```

## 🚀 Publicar na Play Store

### 1. Preparar Assets
Antes de publicar, tenha pronto:
- [ ] Ícone 512x512px
- [ ] Screenshots (mínimo 2)
- [ ] Feature Graphic 1024x500px
- [ ] Descrição da app
- [ ] Política de privacidade

### 2. Upload Manual

1. Acesse: https://play.google.com/console
2. Selecione "Bênção Match"
3. Vá para "Produção" → "Criar nova versão"
4. Upload do AAB que você baixou do EAS
5. Preencher notas da versão
6. Revisar e enviar para análise

### 3. Upload Automático (Opcional)

Configure `eas submit`:
```bash
# Configurar credenciais da Play Store
eas credentials

# Fazer build e submit automaticamente
eas build --profile production --platform android --auto-submit
```

Para isso, você precisa:
- Service Account JSON da Google Cloud Console
- Configurar em eas.json

## 🔄 Atualizações Futuras

### Para cada atualização:

1. **Incrementar versão em app.json**:
```json
{
  "expo": {
    "version": "1.0.1",  // Incrementar versão
    "android": {
      "versionCode": 2   // Sempre incrementar
    }
  }
}
```

2. **Criar novo build**:
```bash
eas build --profile production --platform android
```

3. **Upload na Play Store** na mesma forma anterior

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique logs no dashboard do EAS
- Comum: dependências incompatíveis
- Solução: Verificar package.json e .npmrc

### Erro: "Keystore not found"
- Certifique-se de que configurou credenciais no EAS
- Use `eas credentials` para verificar

### App crashing ao iniciar
- Verifique variáveis de ambiente
- Teste com build de development primeiro
- Verifique logs com `adb logcat`

### Build muito lento
- Normal: 10-20 minutos na nuvem
- Builds subsequentes são mais rápidos (cache)

## 📊 Monitoramento Pós-Publicação

### 1. Instalar Sentry (Crash Reporting)
```bash
npm install @sentry/react-native
```

### 2. Configurar Analytics
- Google Analytics
- Firebase Analytics
- Expo Analytics (built-in)

### 3. Monitorar Play Console
- Crashes e ANRs
- Avaliações de usuários
- Estatísticas de instalação

## 🔗 Links Úteis

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [Expo Dashboard](https://expo.dev)
- [Android Build Docs](https://docs.expo.dev/build-reference/android-builds/)

## ⚡ Comandos Rápidos

```bash
# Build de teste rápido
eas build --profile preview --platform android

# Build de produção
eas build --profile production --platform android

# Ver status dos builds
eas build:list

# Download último build
eas build:download

# Ver credenciais
eas credentials

# Submeter para loja
eas submit --platform android
```

## 💡 Dicas Importantes

1. **Sempre teste com build preview antes de produção**
2. **Mantenha backup do keystore**
3. **Documente cada versão publicada**
4. **Use versionCode sequencial (nunca pule números)**
5. **Teste em dispositivos de baixo custo também**
6. **Monitore consumo de bateria**
7. **Otimize tamanho do APK/AAB**
8. **Configure ProGuard para ofuscar código**

## 📧 Suporte

Em caso de problemas:
- Expo Forums: https://forums.expo.dev
- Stack Overflow: tag `expo`
- Discord Expo: https://chat.expo.dev
