/*
  # Fix organization policies

  1. Changes
    - Simplify policies to prevent infinite recursion
    - Use direct IN clauses instead of nested EXISTS
    - Combine member management policies into a single policy
    - Add proper WITH CHECK clauses

  2. Security
    - Maintain same security model
    - Users can only view their organizations
    - Owners can update organizations
    - Members can view other members in their org
    - Admins/owners can manage members
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their organization" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can update their organization" ON organizations;
DROP POLICY IF EXISTS "Users can view members in their organization" ON organization_members;
DROP POLICY IF EXISTS "Users can join organizations" ON organization_members;
DROP POLICY IF EXISTS "Organization admins can manage members" ON organization_members;

-- Create simplified policies for organizations
CREATE POLICY "Users can view their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Organization owners can update their organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- Create simplified policies for organization members
CREATE POLICY "Users can view members in their organization"
  ON organization_members
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Combined policy for insert/update/delete operations
CREATE POLICY "Organization admins can manage members"
  ON organization_members
  FOR ALL
  TO authenticated
  USING (
    -- Allow users to manage their own membership
    user_id = auth.uid()
    OR
    -- Allow organization admins/owners to manage other members
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    -- Allow users to manage their own membership
    user_id = auth.uid()
    OR
    -- Allow organization admins/owners to manage other members
    organization_id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );