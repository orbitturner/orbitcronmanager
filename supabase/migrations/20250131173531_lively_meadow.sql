-- Check if user_role type exists and create if not
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
  END IF;
END $$;

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

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Organizations policies
  DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
  DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
  DROP POLICY IF EXISTS "Organization owners can update their organization" ON organizations;
  
  -- Organization members policies
  DROP POLICY IF EXISTS "Users can view members in their organization" ON organization_members;
  DROP POLICY IF EXISTS "Users can join organizations" ON organization_members;
  DROP POLICY IF EXISTS "Organization admins can update members" ON organization_members;
  DROP POLICY IF EXISTS "Organization admins can delete members" ON organization_members;
END $$;

-- Create policies for organizations
CREATE POLICY "Users can view their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE organization_members.organization_id = organizations.id 
    AND organization_members.user_id = auth.uid()
  ));

CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Organization owners can update their organization"
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

-- Create policies for organization members
CREATE POLICY "Users can view members in their organization"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM organization_members AS om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid()
  ));

CREATE POLICY "Users can join organizations"
  ON organization_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 
      FROM organization_members AS om 
      WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Organization admins can update members"
  ON organization_members
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM organization_members AS om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  ));

CREATE POLICY "Organization admins can delete members"
  ON organization_members
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM organization_members AS om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  ));

-- Create indexes if not exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE tablename = 'organization_members' 
    AND indexname = 'idx_org_members_user'
  ) THEN
    CREATE INDEX idx_org_members_user ON organization_members(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE tablename = 'organization_members' 
    AND indexname = 'idx_org_members_org'
  ) THEN
    CREATE INDEX idx_org_members_org ON organization_members(organization_id);
  END IF;
END $$;

-- Add comments
COMMENT ON TABLE organizations IS 'Teams/organizations that users can belong to';
COMMENT ON TABLE organization_members IS 'Members of organizations with their roles';
COMMENT ON COLUMN organization_members.role IS 'Role of the member in the organization (owner, admin, member)';