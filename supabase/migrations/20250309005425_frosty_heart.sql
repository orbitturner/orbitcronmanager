/*
  # Add Team Activity Tracking

  1. New Tables
    - `team_activities`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `action` (text)
      - `details` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `team_activities` table
    - Add policies for reading and creating activities

  3. Changes
    - Add last_active_at to organization_members
*/

-- Add last_active_at to organization_members
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organization_members' 
    AND column_name = 'last_active_at'
  ) THEN
    ALTER TABLE organization_members 
    ADD COLUMN last_active_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create team activities table
CREATE TABLE IF NOT EXISTS team_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_action CHECK (
    action = ANY(ARRAY[
      'member_joined',
      'member_left', 
      'role_updated',
      'task_created',
      'task_updated',
      'task_deleted'
    ])
  )
);

-- Enable RLS
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- Indexes
CREATE INDEX idx_team_activities_org_user 
ON team_activities(organization_id, user_id);

CREATE INDEX idx_team_activities_created_at 
ON team_activities(created_at DESC);