/*
  # Create Team Activities Table

  1. New Tables
    - `team_activities`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `user_id` (uuid, references users)
      - `action` (text with check constraint)
      - `details` (jsonb)
      - `created_at` (timestamptz)

  2. Changes
    - Added foreign key constraints to organizations and users
    - Added check constraint for valid actions
    - Created indexes for performance
    - Enabled RLS with policies for organization members

  3. Security
    - Enable RLS
    - Add policies for insert and select
*/

-- Create team activities table
CREATE TABLE IF NOT EXISTS team_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add check constraint for valid actions
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_action'
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_team_activities_org_user ON team_activities(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_created_at ON team_activities(created_at DESC);

-- Enable RLS
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can create activities in their organizations'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read activities from their organizations'
  ) THEN
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
  END IF;
END $$;