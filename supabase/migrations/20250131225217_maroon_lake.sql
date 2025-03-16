-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create role enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
  END IF;
END $$;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table if not exists
CREATE TABLE IF NOT EXISTS tasks (
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
  notification_settings jsonb,
  state text DEFAULT 'ACTIVE',
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  execution_logs jsonb,
  description text,
  priority text CHECK (priority IN ('low', 'medium', 'high')),
  timeout integer CHECK (timeout > 0),
  max_retries integer CHECK (max_retries >= 0),
  retry_delay integer CHECK (retry_delay >= 0),
  tags text[]
);

-- Create organizations table if not exists
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create organization_members table if not exists
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Add organization_id to users if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE users ADD COLUMN organization_id uuid REFERENCES organizations(id);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Create function to handle user creation if not exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user creation if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Add validation constraints if not exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'tasks_state_check'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT tasks_state_check 
      CHECK (state IN ('ACTIVE', 'INACTIVE', 'ERROR'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'tasks_command_check'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT tasks_command_check
      CHECK (
        command IS NULL OR (
          command ? 'script' AND
          command ? 'type' AND
          command->>'type' IN ('bash', 'pwsh')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'tasks_endpoint_check'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT tasks_endpoint_check
      CHECK (
        endpoint IS NULL OR (
          endpoint ? 'url' AND
          endpoint ? 'method' AND
          endpoint->>'method' IN ('GET', 'POST', 'PUT', 'DELETE')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'tasks_mail_recipients_check'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT tasks_mail_recipients_check
      CHECK (
        mail_recipients IS NULL OR mail_recipients ? 'to'
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'tasks_notification_settings_check'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT tasks_notification_settings_check
      CHECK (
        notification_settings IS NULL OR (
          notification_settings ? 'on_success' AND
          notification_settings ? 'on_failure' AND
          notification_settings ? 'include_output'
        )
      );
  END IF;
END $$;

-- Create indexes if not exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_tasks_search'
  ) THEN
    CREATE INDEX idx_tasks_search 
    ON tasks USING GIN (to_tsvector('english', task_name || ' ' || COALESCE(description, '')));
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_tasks_tags'
  ) THEN
    CREATE INDEX idx_tasks_tags 
    ON tasks USING GIN (tags);
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_tasks_priority'
  ) THEN
    CREATE INDEX idx_tasks_priority
    ON tasks (priority);
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_org_members_user'
  ) THEN
    CREATE INDEX idx_org_members_user 
    ON organization_members(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_org_members_org'
  ) THEN
    CREATE INDEX idx_org_members_org 
    ON organization_members(organization_id);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own record" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
DROP POLICY IF EXISTS "View organization" ON organizations;
DROP POLICY IF EXISTS "Create organization" ON organizations;
DROP POLICY IF EXISTS "Update organization" ON organizations;
DROP POLICY IF EXISTS "View organization members" ON organization_members;
DROP POLICY IF EXISTS "Insert organization member" ON organization_members;
DROP POLICY IF EXISTS "Update organization member" ON organization_members;
DROP POLICY IF EXISTS "Delete organization member" ON organization_members;

-- RLS Policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own record"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own record"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for tasks
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

-- RLS Policies for organizations
CREATE POLICY "View organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
  ));

CREATE POLICY "Create organization"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Update organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'owner'
  ));

-- RLS Policies for organization members
CREATE POLICY "View organization members"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Insert organization member"
  ON organization_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Update organization member"
  ON organization_members
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Delete organization member"
  ON organization_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Add comments
COMMENT ON TABLE organizations IS 'Teams/organizations that users can belong to';
COMMENT ON TABLE organization_members IS 'Members of organizations with their roles';
COMMENT ON TABLE tasks IS 'Stores scheduled tasks with their configuration and execution history';
COMMENT ON COLUMN tasks.description IS 'Optional description of the task';
COMMENT ON COLUMN tasks.priority IS 'Task priority: low, medium, or high';
COMMENT ON COLUMN tasks.timeout IS 'Maximum execution time in seconds';
COMMENT ON COLUMN tasks.max_retries IS 'Maximum number of retry attempts on failure';
COMMENT ON COLUMN tasks.retry_delay IS 'Delay between retries in seconds';
COMMENT ON COLUMN tasks.tags IS 'Array of tags for task categorization';
COMMENT ON COLUMN tasks.notification_settings IS 'Configuration for task notifications';
COMMENT ON COLUMN organization_members.role IS 'Role of the member in the organization (owner, admin, member)';