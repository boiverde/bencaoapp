# Checklist para Publicação na Google Play Store

## ✅ Configurações Concluídas

### 1. Configuração do app.json
- [x] Nome do app: "Bênção Match"
- [x] Slug configurado: "bencao-match"
- [x] Package name: "com.bencaomatch.app"
- [x] Versão: 1.0.0
- [x] Version Code: 1
- [x] Ícone configurado
- [x] Splash screen configurado
- [x] Permissões declaradas (Localização, Câmera, Armazenamento)

### 2. Banco de Dados
- [x] Tabelas criadas (users, profiles, matches, likes, posts, messages, etc.)
- [x] RLS habilitado em todas as tabelas
- [x] Políticas de segurança implementadas
- [x] Triggers para matches automáticos
- [x] Sistema de notificações

### 3. Código
- [x] Erros de compilação corrigidos
- [x] Dependências resolvidas (legacy-peer-deps configurado)
- [x] Hooks refatorados sem dependências circulares
- [x] Sistema de autenticação completo

## 📋 Pendências para Publicação

### 1. Assets Visuais (OBRIGATÓRIO)
Você precisa criar:

#### Ícone da Aplicação
- **Ícone principal**: 512x512px PNG (sem transparência)
- **Ícone adaptativo**:
  - Foreground: 512x512px PNG (com transparência)
  - Background: Cor sólida ou imagem 512x512px

#### Screenshots (MÍNIMO 2, MÁXIMO 8)
- **Telefone**: 1080x1920px ou 1080x2340px
- **Tablet 7"**: 1200x1920px (opcional)
- **Tablet 10"**: 1920x1200px (opcional)

Capture telas de:
- Tela inicial/login
- Tela de descoberta de perfis
- Tela de matches
- Tela de chat
- Tela de perfil

#### Feature Graphic (OBRIGATÓRIO)
- **Tamanho**: 1024x500px PNG ou JPG
- Banner promocional que aparece na Play Store

### 2. Descrições da Loja (OBRIGATÓRIO)

#### Título Curto (máx. 30 caracteres)
```
Bênção Match
```

#### Descrição Curta (máx. 80 caracteres)
```
Conecte-se com pessoas que compartilham sua fé e valores cristãos
```

#### Descrição Completa (máx. 4000 caracteres)
```
Bênção Match é o aplicativo de relacionamentos para cristãos que buscam conexões
significativas baseadas na fé.

✨ RECURSOS PRINCIPAIS:

🙏 Comunidade Cristã
- Conecte-se com pessoas que compartilham seus valores e fé
- Filtre por denominação, igreja local e práticas espirituais
- Compartilhe versículos bíblicos e testemunhos

💕 Sistema de Matches Inteligente
- Algoritmo de compatibilidade baseado em valores cristãos
- Descubra perfis compatíveis com seus interesses
- Match instantâneo quando há interesse mútuo

💬 Comunicação Segura
- Chat privado e seguro
- Compartilhe momentos de oração
- Videochamadas para se conhecerem melhor

🌟 Recursos Espirituais
- Versículo do dia
- Pedidos de oração da comunidade
- Eventos e grupos cristãos locais

🔒 Segurança e Privacidade
- Verificação de perfil
- Controles de privacidade avançados
- Ambiente seguro e respeitoso

Baixe agora e encontre alguém que compartilha sua jornada de fé! 🙏❤️
```

### 3. Configuração do Google Play Console

#### Criar conta de desenvolvedor
1. Acesse: https://play.google.com/console
2. Pague a taxa única de US$ 25
3. Preencha informações de contato

#### Criar o aplicativo
1. No Play Console, clique em "Criar aplicativo"
2. Selecione idioma padrão: Português (Brasil)
3. Nome: Bênção Match
4. Tipo: Aplicativo
5. Gratuito ou pago: Gratuito

#### Configurar conteúdo
1. **Classificação de conteúdo**
   - Preencher questionário
   - Categoria: Redes sociais
   - Conteúdo: Interação entre usuários

2. **Público-alvo**
   - Idade: 18+
   - Apelo para crianças: Não

3. **Privacidade**
   - Criar e hospedar política de privacidade
   - URL da política de privacidade (OBRIGATÓRIO)

4. **Segurança dos dados**
   - Declarar quais dados são coletados
   - Como são usados e compartilhados
   - Práticas de segurança

### 4. Build de Produção

#### Usando EAS Build (Recomendado)
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar build
eas build:configure

# Criar build de produção para Android
eas build --platform android --profile production
```

#### Configurar eas.json (criar arquivo)
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  }
}
```

### 5. Assinatura do App (OBRIGATÓRIO)

O Google Play exige que o APK seja assinado:

1. **Criar keystore** (apenas uma vez):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore bencao-match.keystore -alias bencao-match -keyalg RSA -keysize 2048 -validity 10000
```

2. **Guardar credenciais com segurança**:
   - Keystore password
   - Key alias
   - Key password

⚠️ **IMPORTANTE**: Nunca perca o keystore! Você não conseguirá atualizar o app sem ele.

### 6. Testes Internos (Recomendado)

Antes de publicar:
1. Configure "Teste interno" no Play Console
2. Adicione e-mails de testadores
3. Faça upload do APK/AAB para teste
4. Peça feedback sobre bugs e melhorias

### 7. Upload para Produção

1. No Play Console, vá para "Produção"
2. Clique em "Criar nova versão"
3. Faça upload do AAB (Android App Bundle)
4. Preencha notas da versão
5. Revise e publique

### 8. Após a Publicação

- **Tempo de análise**: 2-7 dias úteis
- **Monitoramento**: Acompanhe avaliações e crashes
- **Atualizações**: Incremente versionCode a cada atualização

## 🎯 Próximos Passos Imediatos

1. **Criar assets visuais** (ícones, screenshots, feature graphic)
2. **Escrever política de privacidade**
3. **Criar conta no Google Play Console**
4. **Configurar EAS Build**
5. **Gerar keystore de assinatura**
6. **Criar build de produção**
7. **Testar internamente**
8. **Publicar**

## 📱 Informações de Contato (Necessárias)

Para o Google Play Console, você precisará:
- E-mail de suporte: suporte@bencaomatch.com
- Website (opcional): www.bencaomatch.com
- Telefone de contato (opcional)
- Endereço físico (OBRIGATÓRIO para desenvolvedores)

## 🔐 Segurança e Conformidade

- [ ] Implementar política de privacidade
- [ ] Implementar termos de uso
- [ ] Configurar LGPD/GDPR compliance
- [ ] Implementar sistema de relatório de usuários
- [ ] Implementar moderação de conteúdo
- [ ] Configurar analytics e crash reporting

## 💡 Dicas Importantes

1. **Tamanho do APK**: Mantenha abaixo de 100MB
2. **Desempenho**: Teste em dispositivos de baixo custo
3. **Bateria**: Otimize consumo de bateria
4. **Offline**: Implemente modo offline básico
5. **Atualizações**: Planeje releases regulares

## 📞 Recursos Úteis

- [Google Play Console](https://play.google.com/console)
- [Diretrizes da Play Store](https://play.google.com/about/developer-content-policy/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Application Services](https://expo.dev/eas)
