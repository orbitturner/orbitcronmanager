/*
  # Fix Users RLS Policy

  1. Changes
    - Add RLS policy for users to insert their own record
    - Add RLS policy for users to update their own record

  2. Security
    - Users can only insert/update their own record
    - Maintains existing read policy
*/

-- Add policy for users to insert their own record
CREATE POLICY "Users can insert own record"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add policy for users to update their own record
CREATE POLICY "Users can update own record"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add policy for public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);