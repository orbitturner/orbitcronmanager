/*
  # Enhanced Activity Logging System

  1. Changes
    - Add activity_type classification
    - Add metadata for compliance tracking
    - Add indexes for better query performance
    - Add RLS policies for secure access

  2. New Columns
    - activity_type: Classification of activity (audit, security, system, user)
    - ip_address: Source IP for security tracking
    - user_agent: Browser/client info
    - metadata: Additional contextual data
    - severity: Activity importance level
    - status: Success/failure tracking

  3. Security
    - RLS policies for read/write access
    - Audit trail preservation
*/

-- Add new columns to team_activities
ALTER TABLE team_activities ADD COLUMN IF NOT EXISTS activity_type text CHECK (
  activity_type IN ('audit', 'security', 'system', 'user')
);

ALTER TABLE team_activities ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE team_activities ADD COLUMN IF NOT EXISTS user_agent text;
ALTER TABLE team_activities ADD COLUMN IF NOT EXISTS metadata jsonb;
ALTER TABLE team_activities ADD COLUMN IF NOT EXISTS severity text CHECK (
  severity IN ('info', 'low', 'medium', 'high', 'critical')
);
ALTER TABLE team_activities ADD COLUMN IF NOT EXISTS status text CHECK (
  status IN ('success', 'failure', 'pending')
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_team_activities_type 
  ON team_activities(activity_type);

CREATE INDEX IF NOT EXISTS idx_team_activities_severity 
  ON team_activities(severity);

CREATE INDEX IF NOT EXISTS idx_team_activities_status 
  ON team_activities(status);

CREATE INDEX IF NOT EXISTS idx_team_activities_search 
  ON team_activities USING gin(
    to_tsvector('english',
      coalesce(action,'') || ' ' ||
      coalesce(activity_type,'') || ' ' ||
      coalesce(cast(details as text),'')
    )
  );

-- Enable RLS
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view activities in their organization"
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

CREATE POLICY "Users can create activities in their organization"
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

-- Add check constraint for valid actions
ALTER TABLE team_activities DROP CONSTRAINT IF EXISTS valid_action;
ALTER TABLE team_activities ADD CONSTRAINT valid_action CHECK (
  action IN (
    -- User management
    'user.login',
    'user.logout',
    'user.password_change',
    'user.profile_update',
    -- Team management
    'team.member_joined',
    'team.member_left',
    'team.member_invited',
    'team.role_updated',
    -- Task management
    'task.created',
    'task.updated',
    'task.deleted',
    'task.executed',
    -- System events
    'system.config_changed',
    'system.backup_created',
    'system.error_occurred',
    -- Security events
    'security.access_denied',
    'security.permission_changed'
  )
);