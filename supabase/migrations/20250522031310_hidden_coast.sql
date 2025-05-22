/*
  # Initial schema setup for Christian dating app

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, matches auth.users.id)
      - `email` (text, unique)
      - `full_name` (text)
      - `birth_date` (date)
      - `denomination` (text)
      - `church_name` (text)
      - `favorite_verse` (text)
      - `about_me` (text)
      - `religious_involvement` (text)
      - `location` (point)
      - `languages` (text[])
      - `photos` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to:
      - Read their own profile
      - Read other profiles (for matching)
      - Update their own profile
*/

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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to read other profiles for matching
CREATE POLICY "Users can read other profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() != id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();