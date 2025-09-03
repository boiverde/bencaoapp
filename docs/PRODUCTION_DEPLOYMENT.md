# Guia de Deploy para Produção

## 1. Preparação do Ambiente

### Configurar Variáveis de Ambiente
```bash
# .env.production
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-production-maps-key
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
EXPO_PUBLIC_REVENUECAT_API_KEY=your-production-revenuecat-key
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_WEBSITE_URL=https://bencaomatch.com
```

### Configurar EAS
```bash
# Instalar EAS CLI globalmente
npm install -g @expo/eas-cli

# Login na conta Expo
eas login

# Configurar projeto
eas build:configure
```

## 2. Build para Produção

### Android
```bash
# Build APK para testes
eas build --platform android --profile preview

# Build AAB para Google Play
eas build --platform android --profile production
```

### iOS
```bash
# Build para TestFlight
eas build --platform ios --profile production

# Build para App Store
eas build --platform ios --profile production --auto-submit
```

## 3. Configuração das Lojas

### Google Play Console
1. Criar nova aplicação
2. Configurar detalhes do app:
   - Nome: "Bênção Match"
   - Descrição curta: "Conexões cristãs abençoadas"
   - Descrição completa: [Ver seção de ASO]
   - Categoria: "Social"
   - Classificação: "Maturidade 17+"

3. Upload de assets:
   - Ícone: 512x512px
   - Gráfico de recurso: 1024x500px
   - Capturas de tela: 2-8 imagens

4. Configurar preços e distribuição
5. Preencher classificação de conteúdo
6. Configurar política de privacidade

### App Store Connect
1. Criar novo app
2. Configurar informações básicas:
   - Nome: "Bênção Match"
   - Subtítulo: "Conexões Cristãs"
   - Categoria primária: "Social Networking"
   - Categoria secundária: "Lifestyle"

3. Upload de assets:
   - Ícone: 1024x1024px
   - Capturas de tela para iPhone e iPad
   - Vídeo de preview (opcional)

4. Configurar preços e disponibilidade
5. Preencher informações de revisão
6. Configurar In-App Purchases

## 4. Submissão

### Comandos EAS Submit
```bash
# Submeter para Google Play
eas submit --platform android --latest

# Submeter para App Store
eas submit --platform ios --latest
```

### Processo Manual
1. **Google Play**: Upload do AAB no Play Console
2. **Apple**: Upload via Xcode ou Application Loader

## 5. Monitoramento Pós-Lançamento

### Métricas Críticas
- Crashes e ANRs
- Tempo de carregamento
- Taxa de retenção
- Reviews e ratings
- Conversões para premium

### Ferramentas
- Firebase Crashlytics
- Google Play Console (Android Vitals)
- App Store Connect (Organizer)
- RevenueCat Dashboard

## 6. Estratégia de Lançamento

### Soft Launch
1. Lançar primeiro no Brasil
2. Monitorar métricas por 2-4 semanas
3. Corrigir problemas identificados
4. Expandir para outros países

### Marketing de Lançamento
1. Site oficial (bencaomatch.com)
2. Redes sociais
3. Parcerias com igrejas
4. Influenciadores cristãos
5. ASO (App Store Optimization)

## 7. Suporte Pós-Lançamento

### Canais de Suporte
- Email: suporte@bencaomatch.com
- WhatsApp Business
- FAQ no site
- Chat in-app (premium)

### SLA de Suporte
- Resposta inicial: 24h
- Resolução crítica: 48h
- Resolução geral: 7 dias

## 8. Atualizações e Manutenção

### Cronograma de Updates
- Hotfixes: Conforme necessário
- Updates menores: Quinzenal
- Updates maiores: Mensal
- Grandes features: Trimestral

### Processo de Deploy
1. Desenvolvimento em branch feature
2. Merge para staging
3. Testes em staging
4. Merge para main
5. Build e deploy automático
6. Monitoramento pós-deploy