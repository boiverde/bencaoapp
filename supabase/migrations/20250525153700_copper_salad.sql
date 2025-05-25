/*
  # Initial Schema Setup

  1. Types
    - Create message_type and match_status enums
  
  2. Tables
    - profiles: User profile information
    - matches: Connections between users
    - likes: User likes/interests
    - conversations: Chat conversations
    - messages: Individual messages
  
  3. Security
    - Enable RLS on all tables
    - Create policies for data access control
    - Set up helper functions for security checks
*/

-- Create custom types if they don't exist
DO $$ BEGIN
  CREATE TYPE message_type AS ENUM ('text', 'verse', 'prayer');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  birth_date date NOT NULL,
  denomination text NOT NULL,
  church_name text,
  favorite_verse text,
  about_me text,
  religious_involvement text,
  location point,
  languages text[],
  photos text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id) NOT NULL,
  user2_id uuid REFERENCES profiles(id) NOT NULL,
  status match_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (user1_id <> user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) NOT NULL,
  to_user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (from_user_id <> to_user_id),
  UNIQUE(from_user_id, to_user_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) NOT NULL,
  sender_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  type message_type DEFAULT 'text',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can read other profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can read their matches" ON matches;
  DROP POLICY IF EXISTS "Users can update their matches" ON matches;
  DROP POLICY IF EXISTS "Users can create likes" ON likes;
  DROP POLICY IF EXISTS "Users can read likes" ON likes;
  DROP POLICY IF EXISTS "Users can read their conversations" ON conversations;
  DROP POLICY IF EXISTS "Users can read messages in their conversations" ON messages;
  DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Drop and recreate the conversation participant function
DROP FUNCTION IF EXISTS is_conversation_participant(uuid) CASCADE;

CREATE OR REPLACE FUNCTION is_conversation_participant(conv_id uuid) 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversations c
    JOIN matches m ON m.id = c.match_id
    WHERE c.id = conv_id 
    AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() <> id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Matches policies
CREATE POLICY "Users can read their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

CREATE POLICY "Users can update their matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING ((auth.uid() = user1_id) OR (auth.uid() = user2_id))
  WITH CHECK ((auth.uid() = user1_id) OR (auth.uid() = user2_id));

-- Likes policies
CREATE POLICY "Users can create likes"
  ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can read likes"
  ON likes
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = from_user_id) OR (auth.uid() = to_user_id));

-- Conversations policies
CREATE POLICY "Users can read their conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM matches m
    WHERE m.id = match_id
    AND (auth.uid() = m.user1_id OR auth.uid() = m.user2_id)
  ));

-- Messages policies
CREATE POLICY "Users can read messages in their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (is_conversation_participant(conversation_id));

CREATE POLICY "Users can send messages in their conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_conversation_participant(conversation_id)
    AND auth.uid() = sender_id
  );