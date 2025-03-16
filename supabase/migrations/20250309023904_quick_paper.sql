/*
  # User Activities System

  1. New Tables
    - `user_activities`: Comprehensive user activity tracking system
      - Core fields:
        - `id` (uuid, primary key)
        - `user_id` (uuid, references auth.users)
        - `action` (text)
        - `details` (jsonb)
        - `created_at` (timestamptz)
      - Classification fields:
        - `activity_type` (text)
        - `category` (text)
        - `status` (text)
      - Context fields:
        - `ip_address` (text)
        - `user_agent` (text)
        - `session_id` (text)
        - `resource_type` (text)
        - `resource_id` (text)
      - Compliance fields:
        - `metadata` (jsonb)
        - `compliance_tags` (text[])

  2. Security
    - Enable RLS
    - Add policies for user data access
    - Create helper functions for activity logging
*/

-- Drop existing table and functions if they exist
DROP TABLE IF EXISTS user_activities CASCADE;
DROP FUNCTION IF EXISTS get_client_info CASCADE;
DROP FUNCTION IF EXISTS log_user_activity CASCADE;

-- Create user activities table
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Classification
  activity_type TEXT CHECK (activity_type IN (
    'auth',           -- Authentication events
    'data',          -- Data operations
    'configuration', -- System configuration
    'security',      -- Security-related events
    'task',          -- Task operations
    'api',           -- API interactions
    'compliance',    -- Compliance-related actions
    'system'         -- System events
  )),
  category TEXT CHECK (category IN (
    'create',
    'read',
    'update',
    'delete',
    'execute',
    'login',
    'logout',
    'export',
    'import',
    'share',
    'configure'
  )),
  status TEXT CHECK (status IN (
    'success',
    'failure',
    'pending',
    'cancelled',
    'error'
  )),
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  resource_type TEXT,
  resource_id TEXT,
  
  -- Compliance
  metadata JSONB,
  compliance_tags TEXT[],

  -- Action validation
  CONSTRAINT valid_action CHECK (
    action = ANY (ARRAY[
      -- Authentication actions
      'login',
      'logout',
      'password_change',
      'mfa_enabled',
      'mfa_disabled',
      'session_expired',
      
      -- Data actions
      'data_created',
      'data_updated',
      'data_deleted',
      'data_exported',
      'data_imported',
      
      -- Task actions
      'task_created',
      'task_updated',
      'task_deleted',
      'task_executed',
      'task_scheduled',
      'task_cancelled',
      
      -- Configuration actions
      'settings_updated',
      'preferences_changed',
      'notification_configured',
      
      -- Security actions
      'permission_changed',
      'role_updated',
      'access_granted',
      'access_revoked',
      
      -- Team actions
      'team_joined',
      'team_left',
      'member_invited',
      'member_removed',
      
      -- System actions
      'report_generated',
      'backup_created',
      'system_configured',
      'error_occurred'
    ])
  )
);

-- Enable RLS
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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
CREATE INDEX idx_user_activities_category ON user_activities(category);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);
CREATE INDEX idx_user_activities_resource ON user_activities(resource_type, resource_id);
CREATE INDEX idx_user_activities_compliance ON user_activities USING gin(compliance_tags);
CREATE INDEX idx_user_activities_search ON user_activities 
  USING gin(to_tsvector('english', 
    coalesce(action, '') || ' ' || 
    coalesce(activity_type, '') || ' ' || 
    coalesce(category, '') || ' ' || 
    coalesce(details::text, '')
  ));

-- Create helper function to get client info
CREATE OR REPLACE FUNCTION get_client_info()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN jsonb_build_object(
    'ip_address', current_setting('request.headers')::jsonb->>'x-forwarded-for',
    'user_agent', current_setting('request.headers')::jsonb->>'user-agent'
  );
END;
$$;

-- Create function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_action TEXT,
  p_details JSONB DEFAULT NULL,
  p_activity_type TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_compliance_tags TEXT[] DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_client_info jsonb;
  v_activity_id uuid;
BEGIN
  -- Get client info
  v_client_info := get_client_info();
  
  -- Insert activity
  INSERT INTO user_activities (
    user_id,
    action,
    details,
    activity_type,
    category,
    ip_address,
    user_agent,
    resource_type,
    resource_id,
    compliance_tags,
    status,
    session_id
  )
  VALUES (
    auth.uid(),
    p_action,
    p_details,
    p_activity_type,
    p_category,
    v_client_info->>'ip_address',
    v_client_info->>'user_agent',
    p_resource_type,
    p_resource_id,
    p_compliance_tags,
    'success',
    current_setting('request.jwt.claims', true)::jsonb->>'session_id'
  )
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION log_user_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_client_info TO authenticated;