/*
  # Recreate Team Activities Table

  1. Changes
    - Drop existing team_activities table
    - Recreate table with correct foreign key references
    - Add check constraint for valid actions
    - Create indexes for performance
    - Enable RLS with policies

  2. Security
    - Enable RLS
    - Add policies for insert and select
*/

-- Drop existing table
DROP TABLE IF EXISTS team_activities;

-- Create team activities table
CREATE TABLE team_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add check constraint for valid actions
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

-- Create indexes
CREATE INDEX idx_team_activities_org_user ON team_activities(organization_id, user_id);
CREATE INDEX idx_team_activities_created_at ON team_activities(created_at DESC);

-- Enable RLS
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;

-- Policies
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