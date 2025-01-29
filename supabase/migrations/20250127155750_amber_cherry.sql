/*
  # Initial Schema Setup for OrbitCronManager

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
    
    - `tasks`
      - `uuid` (uuid, primary key)
      - `task_name` (text, unique)
      - `cron_expression` (text)
      - `command` (jsonb, nullable)
      - `endpoint` (jsonb, nullable)
      - `is_command` (boolean)
      - `is_request` (boolean)
      - `launch_on_save` (boolean)
      - `last_execution_date` (text)
      - `last_execution_result` (text)
      - `mail_recipients` (jsonb, nullable)
      - `state` (text)
      - `created_by` (uuid, references users)
      - `created_at` (timestamp)
      - `execution_logs` (jsonb, nullable)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
  uuid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  execution_logs jsonb
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

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