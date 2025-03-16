/*
  # Add Team Activities Table

  1. New Tables
    - `team_activities`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key to organizations)
      - `user_id` (uuid, foreign key to auth.users)
      - `action` (text with enum check)
      - `details` (jsonb)
      - `created_at` (timestamp with time zone)

  2. Changes
    - Add foreign key relationships to organizations and auth.users
    - Add enum check constraint for action types
    - Enable RLS policies for proper access control

  3. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Insert activities for their organizations
      - View activities from their organizations
*/

-- Create team activities table if it doesn't exist
CREATE TABLE IF NOT EXISTS team_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add check constraint for valid actions if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_action' AND conrelid = 'team_activities'::regclass
  ) THEN
    ALTER TABLE team_activities
    ADD CONSTRAINT valid_action CHECK (
      action = ANY (ARRAY[
        'member_joined',
        'member_left',
        'role_updated',
        'task_created',
        'task_updated',
        'task_deleted'
      ])
    );
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_team_activities_org_user ON team_activities(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_created_at ON team_activities(created_at DESC);

-- Enable RLS
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create activities in their organizations" ON team_activities;
DROP POLICY IF EXISTS "Users can read activities from their organizations" ON team_activities;

-- Create new policies
CREATE POLICY "Users can create activities in their organizations"
  ON team_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read activities from their organizations"
  ON team_activities
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );