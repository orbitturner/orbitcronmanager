/*
  # Add Organization ID to Tasks Table

  1. Changes
    - Add organization_id column to tasks table
    - Add foreign key constraint to organizations table
    - Add index for performance
    - Update RLS policies to include organization check

  2. Security
    - Maintain existing RLS
    - Add organization-based access control
*/

-- Add organization_id column
ALTER TABLE tasks
ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_tasks_organization ON tasks(organization_id);

-- Update RLS policies to include organization check
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;

CREATE POLICY "Users can read tasks in their organization"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in their organization"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in their organization"
  ON tasks
  FOR UPDATE
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
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );