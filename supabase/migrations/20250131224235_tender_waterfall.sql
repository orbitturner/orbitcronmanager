-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can update their organization" ON organizations;
DROP POLICY IF EXISTS "Users can view members in their organization" ON organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON organization_members;

-- Create new non-recursive policies for organizations
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

-- Create new non-recursive policies for organization members
CREATE POLICY "View organization members"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM organization_members AS om 
    WHERE om.organization_id = organization_members.organization_id 
    AND om.user_id = auth.uid()
  ));

CREATE POLICY "Insert organization member"
  ON organization_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow users to insert themselves
    user_id = auth.uid()
    OR
    -- Allow admins/owners to insert others
    EXISTS (
      SELECT 1 
      FROM organization_members AS om 
      WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Update organization member"
  ON organization_members
  FOR UPDATE
  TO authenticated
  USING (
    -- Allow users to update their own record
    user_id = auth.uid()
    OR
    -- Allow admins/owners to update others
    EXISTS (
      SELECT 1 
      FROM organization_members AS om 
      WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Delete organization member"
  ON organization_members
  FOR DELETE
  TO authenticated
  USING (
    -- Allow users to delete their own record
    user_id = auth.uid()
    OR
    -- Allow admins/owners to delete others
    EXISTS (
      SELECT 1 
      FROM organization_members AS om 
      WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );