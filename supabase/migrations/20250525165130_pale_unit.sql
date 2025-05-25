/*
  # Initial Schema Setup

  1. Tables
    - profiles: User profiles with personal and religious information
    - matches: Connections between users
    - likes: User likes/interests
    - conversations: Chat conversations between matched users
    - messages: Individual messages in conversations

  2. Security
    - Row Level Security (RLS) enabled on all tables
    - Policies for user access control
    - Helper functions for security checks

  3. Triggers
    - Automatic updated_at timestamp updates
*/

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
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create helper function for conversation participant check
CREATE OR REPLACE FUNCTION is_conversation_participant(conversation_uuid uuid) 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversations c
    JOIN matches m ON m.id = c.match_id
    WHERE c.id = conversation_uuid 
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

-- Create triggers for updated_at
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies

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