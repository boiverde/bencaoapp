# Instruções de Configuração para Produção

## 1. Configurar Supabase

### Passo 1: Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha os detalhes do projeto:
   - Nome: "Bênção Match"
   - Database Password: (gere uma senha forte)
   - Região: South America (São Paulo)

### Passo 2: Configurar Variáveis de Ambiente
1. No dashboard do Supabase, vá em Settings > API
2. Copie a URL do projeto e a chave anônima
3. Atualize o arquivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Passo 3: Executar Migrações
1. No dashboard do Supabase, vá em SQL Editor
2. Execute o conteúdo do arquivo `supabase/migrations/create_initial_schema.sql`

### Passo 4: Configurar Storage
1. No dashboard do Supabase, vá em Storage
2. Crie um bucket chamado "profile-photos"
3. Configure as políticas de acesso:

```sql
-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to photos
CREATE POLICY "Public photo access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');
```

## 2. Configurar Cloudinary (Alternativa para Imagens)

### Passo 1: Criar Conta
1. Acesse [cloudinary.com](https://cloudinary.com)
2. Crie uma conta gratuita
3. Acesse o Dashboard

### Passo 2: Configurar Upload Preset
1. Vá em Settings > Upload
2. Clique em "Add upload preset"
3. Configure:
   - Preset name: "bencao_match_uploads"
   - Signing Mode: "Unsigned"
   - Folder: "bencao-match"
   - Transformations: Resize to 800px width

### Passo 3: Atualizar Variáveis de Ambiente
```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
EXPO_PUBLIC_CLOUDINARY_API_KEY=sua-api-key
```

## 3. Configurar Firebase (Notificações Push)

### Passo 1: Criar Projeto Firebase
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Nome: "Bênção Match"
4. Ative Google Analytics (opcional)

### Passo 2: Configurar para Android
1. Adicione um app Android
2. Package name: `com.bencaomatch.app`
3. Baixe o `google-services.json`
4. Coloque na raiz do projeto

### Passo 3: Configurar para iOS
1. Adicione um app iOS
2. Bundle ID: `com.bencaomatch.app`
3. Baixe o `GoogleService-Info.plist`
4. Configure no Expo:

```json
"ios": {
  "googleServicesFile": "./GoogleService-Info.plist"
}
```

### Passo 4: Atualizar Variáveis de Ambiente
```env
EXPO_PUBLIC_FIREBASE_API_KEY=sua-firebase-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
```

## 4. Configurar Google Maps

### Passo 1: Criar Projeto no Google Cloud
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Ative as APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### Passo 2: Criar Chave de API
1. Vá em "Credenciais"
2. Clique em "Criar credenciais" > "Chave de API"
3. Configure restrições:
   - Aplicativos Android: adicione SHA-1 fingerprint
   - Aplicativos iOS: adicione Bundle ID

### Passo 3: Atualizar Variáveis de Ambiente
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua-maps-key
```

## 5. Configurar EAS (Expo Application Services)

### Passo 1: Instalar EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Passo 2: Login e Configurar
```bash
eas login
eas build:configure
```

### Passo 3: Atualizar eas.json
```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 6. Configurar RevenueCat (Pagamentos)

### Passo 1: Criar Conta RevenueCat
1. Acesse [revenuecat.com](https://www.revenuecat.com)
2. Crie uma conta
3. Crie um novo projeto

### Passo 2: Configurar Produtos
1. Configure produtos no App Store Connect (iOS)
2. Configure produtos no Google Play Console (Android)
3. Adicione os produtos no RevenueCat

### Passo 3: Instalar SDK (após exportar projeto)
```bash
npx expo install react-native-purchases expo-dev-client
```

## 7. Comandos para Build e Deploy

### Build de Desenvolvimento
```bash
eas build --platform all --profile development
```

### Build de Preview
```bash
eas build --platform all --profile preview
```

### Build de Produção
```bash
eas build --platform all --profile production
```

### Submit para Lojas
```bash
eas submit --platform all
```

## 8. Checklist Final

- [ ] Supabase configurado e migrações executadas
- [ ] Firebase configurado para notificações
- [ ] Google Maps configurado
- [ ] Cloudinary ou Supabase Storage configurado
- [ ] EAS configurado
- [ ] Variáveis de ambiente atualizadas
- [ ] Testes realizados em dispositivos reais
- [ ] Documentação legal preparada
- [ ] Assets das lojas preparados
- [ ] RevenueCat configurado (se necessário)

## 9. Próximos Passos

1. **Configurar Supabase** - Prioridade máxima
2. **Testar autenticação real** - Verificar se funciona
3. **Implementar upload de imagens** - Cloudinary ou Supabase
4. **Configurar notificações** - Firebase
5. **Preparar assets das lojas** - Ícones e capturas de tela
6. **Criar builds de produção** - EAS Build
7. **Submeter para lojas** - Google Play e App Store

## Suporte

Para dúvidas sobre a configuração, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Expo](https://docs.expo.dev)
- [Documentação do RevenueCat](https://docs.revenuecat.com)