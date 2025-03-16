/*
  # Add Organization Policies for Tasks

  1. Changes
    - Add NOT NULL constraint to organization_id
    - Update RLS policies for organization-based access
    - Add helper function to check organization membership

  2. Security
    - Enable RLS on tasks table
    - Add policies for CRUD operations based on organization membership
    - Ensure users can only access tasks in their organizations
*/

-- Create helper function to check organization membership
CREATE OR REPLACE FUNCTION public.is_organization_member(org_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_id = org_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make organization_id NOT NULL
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'organization_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE tasks ALTER COLUMN organization_id SET NOT NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can create tasks in their organization" ON tasks;
DROP POLICY IF EXISTS "Users can read tasks in their organization" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks in their organization" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks in their organization" ON tasks;

-- Create new policies
CREATE POLICY "Users can create tasks in their organization"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read tasks in their organization"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in their organization"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in their organization"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_organization_id ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);