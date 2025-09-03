# Requisitos de Backend para Lançamento

## 1. Sistema de Autenticação Real

### Supabase Auth Setup
```typescript
// utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Migração de Autenticação
- Substituir mock auth por Supabase Auth
- Implementar verificação de email
- Configurar OAuth (Google, Facebook)
- Sistema de recuperação de senha real

## 2. Banco de Dados

### Tabelas Necessárias:
```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  denomination TEXT,
  location JSONB,
  bio TEXT,
  photos TEXT[],
  preferences JSONB,
  personality JSONB,
  values JSONB,
  lifestyle JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conexões/Matches
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES users(id),
  user2_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('pending', 'matched', 'blocked')),
  compatibility_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversas
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participants UUID[],
  type TEXT CHECK (type IN ('direct', 'group', 'prayer_circle')),
  title TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'voice', 'image', 'verse', 'prayer')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location JSONB,
  organizer_id UUID REFERENCES users(id),
  attendees UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos de Oração
CREATE TABLE prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  prayed_by UUID[],
  answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 3. APIs Necessárias

### Serviços Externos:
- **Geolocalização**: Google Maps API ou similar
- **Upload de Imagens**: Cloudinary ou AWS S3
- **Notificações Push**: Firebase Cloud Messaging
- **Tradução**: Google Translate API
- **Moderação de Conteúdo**: AWS Comprehend ou similar
- **Verificação de Identidade**: Serviço de KYC

### APIs Internas:
- Sistema de matching/compatibilidade
- Sistema de chat em tempo real
- Sistema de notificações
- Sistema de gamificação
- Sistema de pagamentos (RevenueCat)

## 4. Segurança e Compliance

### LGPD/GDPR Compliance:
- Consentimento explícito para coleta de dados
- Direito ao esquecimento
- Portabilidade de dados
- Notificação de vazamentos

### Moderação de Conteúdo:
- Filtros automáticos de conteúdo
- Sistema de denúncias
- Moderação humana
- Verificação de perfis

## 5. Performance e Escalabilidade

### Otimizações:
- CDN para imagens
- Cache de dados
- Lazy loading
- Paginação de feeds
- Compressão de imagens

### Monitoramento:
- Logs de erro (Sentry)
- Analytics (Firebase Analytics)
- Performance monitoring
- Uptime monitoring