/*
  # Add User Activities Table

  1. New Tables
    - `user_activities`: Stores individual user activities
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `action` (text)
      - `details` (jsonb)
      - `created_at` (timestamptz)
      - `activity_type` (text)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on `user_activities` table
    - Add policies for users to read their own activities
*/

-- Create user activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  activity_type TEXT CHECK (activity_type IN ('task', 'auth', 'profile', 'system')),
  metadata JSONB,
  CONSTRAINT valid_action CHECK (
    action = ANY (ARRAY[
      'login',
      'logout',
      'password_change',
      'profile_update',
      'task_created',
      'task_updated',
      'task_deleted',
      'task_executed',
      'joined_team',
      'left_team',
      'settings_updated'
    ])
  )
);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own activities"
  ON user_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own activities"
  ON user_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX idx_user_activities_user ON user_activities(user_id);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_user_activities_search ON user_activities 
  USING gin(to_tsvector('english', action || ' ' || COALESCE(details::text, '')));