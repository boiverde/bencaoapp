/*
  # Match system tables

  1. New Tables
    - `matches`
      - `id` (uuid, primary key)
      - `user1_id` (uuid, references profiles)
      - `user2_id` (uuid, references profiles)
      - `status` (text, enum of match states)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `likes`
      - `id` (uuid, primary key)
      - `from_user_id` (uuid, references profiles)
      - `to_user_id` (uuid, references profiles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Create likes
      - Read their own matches
      - Update their match status
*/

-- Match status enum
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id) NOT NULL,
  user2_id uuid REFERENCES profiles(id) NOT NULL,
  status match_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (user1_id != user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) NOT NULL,
  to_user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT different_users CHECK (from_user_id != to_user_id),
  UNIQUE(from_user_id, to_user_id)
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Matches policies
CREATE POLICY "Users can read their matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (user1_id, user2_id));

CREATE POLICY "Users can update their matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (user1_id, user2_id))
  WITH CHECK (auth.uid() IN (user1_id, user2_id));

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
  USING (auth.uid() IN (from_user_id, to_user_id));

-- Update trigger for matches
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();