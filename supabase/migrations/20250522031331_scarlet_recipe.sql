/*
  # Messaging system

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `match_id` (uuid, references matches)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `messages`
      - `id` (uuid, primary key)
      - `conversation_id` (uuid, references conversations)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `type` (text, enum of message types)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read and write messages in their conversations
      - Read conversations they're part of
*/

-- Message types enum
CREATE TYPE message_type AS ENUM ('text', 'verse', 'prayer');

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) NOT NULL,
  sender_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  type message_type DEFAULT 'text',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is part of conversation
CREATE OR REPLACE FUNCTION is_conversation_participant(conversation_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM conversations c
    JOIN matches m ON c.match_id = m.id
    WHERE c.id = conversation_id
    AND auth.uid() IN (m.user1_id, m.user2_id)
  );
END;
$$ language plpgsql security definer;

-- Conversations policies
CREATE POLICY "Users can read their conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
      AND auth.uid() IN (m.user1_id, m.user2_id)
    )
  );

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

-- Update trigger for conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();