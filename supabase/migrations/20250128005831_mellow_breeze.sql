/*
  # Update Tasks Schema

  1. Changes
    - Add new columns to tasks table:
      - description (text)
      - priority (text)
      - timeout (integer)
      - max_retries (integer)
      - retry_delay (integer)
      - tags (text[])
      - notification_settings (jsonb)
    - Update command and endpoint columns to support new options
    - Update mail_recipients to support new fields
    - Add check constraints for validation

  2. Security
    - Maintain existing RLS policies
    - Add validation constraints
*/

-- Add new columns to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS timeout integer CHECK (timeout > 0),
ADD COLUMN IF NOT EXISTS max_retries integer CHECK (max_retries >= 0),
ADD COLUMN IF NOT EXISTS retry_delay integer CHECK (retry_delay >= 0),
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS notification_settings jsonb;

-- Update state enum validation
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_state_check,
ADD CONSTRAINT tasks_state_check 
  CHECK (state IN ('ACTIVE', 'INACTIVE', 'ERROR'));

-- Add JSON schema validation for command
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_command_check,
ADD CONSTRAINT tasks_command_check
  CHECK (
    command IS NULL OR (
      command ? 'script' AND
      command ? 'type' AND
      command->>'type' IN ('bash', 'pwsh')
    )
  );

-- Add JSON schema validation for endpoint
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_endpoint_check,
ADD CONSTRAINT tasks_endpoint_check
  CHECK (
    endpoint IS NULL OR (
      endpoint ? 'url' AND
      endpoint ? 'method' AND
      endpoint->>'method' IN ('GET', 'POST', 'PUT', 'DELETE')
    )
  );

-- Add JSON schema validation for mail_recipients
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_mail_recipients_check,
ADD CONSTRAINT tasks_mail_recipients_check
  CHECK (
    mail_recipients IS NULL OR mail_recipients ? 'to'
  );

-- Add JSON schema validation for notification_settings
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_notification_settings_check,
ADD CONSTRAINT tasks_notification_settings_check
  CHECK (
    notification_settings IS NULL OR (
      notification_settings ? 'on_success' AND
      notification_settings ? 'on_failure' AND
      notification_settings ? 'include_output'
    )
  );

-- Add index for task search
CREATE INDEX IF NOT EXISTS idx_tasks_search 
ON tasks USING GIN (to_tsvector('english', task_name || ' ' || COALESCE(description, '')));

-- Add index for tags
CREATE INDEX IF NOT EXISTS idx_tasks_tags 
ON tasks USING GIN (tags);

-- Add index for priority
CREATE INDEX IF NOT EXISTS idx_tasks_priority
ON tasks (priority);

COMMENT ON TABLE tasks IS 'Stores scheduled tasks with their configuration and execution history';
COMMENT ON COLUMN tasks.description IS 'Optional description of the task';
COMMENT ON COLUMN tasks.priority IS 'Task priority: low, medium, or high';
COMMENT ON COLUMN tasks.timeout IS 'Maximum execution time in seconds';
COMMENT ON COLUMN tasks.max_retries IS 'Maximum number of retry attempts on failure';
COMMENT ON COLUMN tasks.retry_delay IS 'Delay between retries in seconds';
COMMENT ON COLUMN tasks.tags IS 'Array of tags for task categorization';
COMMENT ON COLUMN tasks.notification_settings IS 'Configuration for task notifications';