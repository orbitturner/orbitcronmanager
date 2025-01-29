/*
  # Create tasks table and RLS policies
  
  1. Tables
    - Create tasks table to store task information
    - Add foreign key constraint to users table
  
  2. Security
    - Enable RLS on tasks table
    - Add policies for CRUD operations
*/

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name text UNIQUE NOT NULL,
  cron_expression text NOT NULL,
  command jsonb,
  endpoint jsonb,
  is_command boolean NOT NULL,
  is_request boolean NOT NULL,
  launch_on_save boolean DEFAULT false,
  last_execution_date text,
  last_execution_result text,
  mail_recipients jsonb,
  state text DEFAULT 'ACTIVE',
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  execution_logs jsonb
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());