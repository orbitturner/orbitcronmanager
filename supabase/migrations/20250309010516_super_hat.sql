/*
  # Add Last Active Timestamp to Organization Members

  1. Changes
    - Add last_active_at column to organization_members table
    - Set default value to current timestamp
    - Update existing rows

  2. Security
    - Maintain existing RLS policies
*/

-- Add last_active_at column
ALTER TABLE organization_members
ADD COLUMN IF NOT EXISTS last_active_at timestamptz DEFAULT now();

-- Update existing rows
UPDATE organization_members
SET last_active_at = now()
WHERE last_active_at IS NULL;