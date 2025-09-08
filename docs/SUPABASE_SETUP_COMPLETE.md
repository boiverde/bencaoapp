# Guia Completo: Como Configurar o Supabase

## 🎯 **PASSO A PASSO DETALHADO**

### **ETAPA 1: Criar Conta e Projeto (5 minutos)**

1. **Acesse**: [supabase.com](https://supabase.com)
2. **Clique em**: "Start your project" 
3. **Faça login** com GitHub, Google ou email
4. **Clique em**: "New Project"
5. **Preencha**:
   - **Organization**: Sua organização (ou crie uma nova)
   - **Name**: `Bênção Match`
   - **Database Password**: Gere uma senha forte (ANOTE ESTA SENHA!)
   - **Region**: `South America (São Paulo)`
6. **Clique em**: "Create new project"
7. **Aguarde**: 2-3 minutos para o projeto ser criado

### **ETAPA 2: Obter Credenciais (2 minutos)**

1. **No dashboard do projeto**, vá em **Settings** → **API**
2. **Copie estas informações**:
   - **Project URL**: `https://seu-projeto-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **ETAPA 3: Configurar Variáveis de Ambiente (1 minuto)**

1. **Abra o arquivo `.env`** na raiz do projeto
2. **Substitua** as linhas existentes por:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui

# Outras configurações (opcional por enquanto)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=
EXPO_PUBLIC_CLOUDINARY_API_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_WEBSITE_URL=https://bencaomatch.com
```

### **ETAPA 4: Executar Migrações SQL (10 minutos)**

1. **No dashboard do Supabase**, vá em **SQL Editor**
2. **Execute CADA arquivo SQL** na ordem abaixo:

#### **4.1 - Criar Tabela de Usuários**
```sql
/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `age` (integer)
      - `denomination` (text)
      - `location` (jsonb)
      - `bio` (text)
      - `photos` (text array)
      - `preferences` (jsonb)
      - `personality` (jsonb)
      - `values` (jsonb)
      - `lifestyle` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `users` table
    - Add policy for authenticated users to read/update their own data
    - Add policy for public read access to basic profile info
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer,
  denomination text,
  location jsonb,
  bio text,
  photos text[],
  preferences jsonb,
  personality jsonb,
  values jsonb,
  lifestyle jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can manage own data"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Public can read basic profile info for matching
CREATE POLICY "Public can read basic profile info"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### **4.2 - Criar Tabela de Conexões**
```sql
/*
  # Create connections table

  1. New Tables
    - `connections`
      - `id` (uuid, primary key)
      - `user1_id` (uuid, foreign key to users)
      - `user2_id` (uuid, foreign key to users)
      - `status` (text, check constraint)
      - `compatibility_score` (integer)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `connections` table
    - Add policy for users to see their own connections
*/

CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES users(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text CHECK (status IN ('pending', 'matched', 'blocked')) DEFAULT 'pending',
  compatibility_score integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Users can see connections they are part of
CREATE POLICY "Users can see own connections"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can create connections
CREATE POLICY "Users can create connections"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user1_id);

-- Users can update connections they are part of
CREATE POLICY "Users can update own connections"
  ON connections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
```

#### **4.3 - Criar Tabela de Conversas**
```sql
/*
  # Create conversations table

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `participants` (uuid array)
      - `type` (text, check constraint)
      - `title` (text, nullable)
      - `last_activity` (timestamp)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `conversations` table
    - Add policy for participants to access conversations
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participants uuid[] NOT NULL,
  type text CHECK (type IN ('direct', 'group', 'prayer_circle')) DEFAULT 'direct',
  title text,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Participants can access their conversations
CREATE POLICY "Participants can access conversations"
  ON conversations
  FOR ALL
  TO authenticated
  USING (auth.uid() = ANY(participants));
```

#### **4.4 - Criar Tabela de Mensagens**
```sql
/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, foreign key to conversations)
      - `sender_id` (uuid, foreign key to users)
      - `content` (text)
      - `type` (text, check constraint)
      - `metadata` (jsonb)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `messages` table
    - Add policy for conversation participants to access messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  type text CHECK (type IN ('text', 'voice', 'image', 'verse', 'prayer')) DEFAULT 'text',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversation participants can access messages
CREATE POLICY "Conversation participants can access messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id 
      AND auth.uid() = ANY(participants)
    )
  );
```

#### **4.5 - Criar Storage Buckets**
```sql
/*
  # Create storage buckets

  1. Storage Buckets
    - `profile-photos` - For user profile pictures
    - `chat-media` - For chat images and files
  2. Security
    - Users can upload to their own folders
    - Public read access for profile photos
*/

-- Create profile photos bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create chat media bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-media', 'chat-media', false)
ON CONFLICT (id) DO NOTHING;

-- Policy for profile photos upload
CREATE POLICY "Users can upload own profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for profile photos read
CREATE POLICY "Public can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Policy for chat media upload
CREATE POLICY "Users can upload chat media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for chat media read
CREATE POLICY "Conversation participants can view chat media"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-media');
```

### **ETAPA 5: Testar Configuração (5 minutos)**

1. **Reinicie o servidor**: `npx expo start --clear`
2. **Abra o app** e vá para **Login**
3. **Crie uma conta real** com seu email
4. **Verifique** se os dados persistem

### **ETAPA 6: Verificar se Funcionou**

**✅ Sinais de que está funcionando:**
- Login cria usuário real no Supabase
- Dados persistem ao recarregar
- Dashboard do Supabase mostra novos usuários
- Não há mais mensagens de "modo mock"

**❌ Se não funcionar:**
- Verifique se as variáveis de ambiente estão corretas
- Confirme se todas as migrações foram executadas
- Veja o console do navegador para erros

## 🚨 **ATENÇÃO IMPORTANTE**

**NUNCA COMPARTILHE**:
- Sua chave de serviço (service_role key)
- Senha do banco de dados
- Credenciais de produção

**SEMPRE USE**:
- Apenas a chave anônima (anon key) no frontend
- HTTPS em produção
- Row Level Security (RLS)

## 🎉 **APÓS CONFIGURAR**

O aplicativo terá:
- ✅ Autenticação real
- ✅ Dados persistentes
- ✅ Upload de imagens (Supabase Storage)
- ✅ Base para chat em tempo real
- ✅ Sistema de usuários real

**Tempo estimado total: 15-20 minutos**

Precisa de ajuda com algum passo específico?