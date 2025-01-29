export interface Command {
  script: string;
  type: 'bash' | 'pwsh';
  options?: {
    timeout_enabled?: boolean;
    elevated_privileges?: boolean;
    save_output?: boolean;
    timeout?: number;
    working_directory?: string;
    environment_variables?: Record<string, string>;
  };
}

export interface AuthRequest {
  url: string;
  headers: { [key: string]: string };
  data: { [key: string]: string };
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  token_field: string;
}

export interface Endpoint {
  auth_request?: AuthRequest;
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  authorization_type: 'Bearer';
  data?: any;
  headers?: any;
  options?: {
    timeout?: number;
    retry?: {
      enabled: boolean;
      max_attempts?: number;
      delay?: number;
    };
    validate_ssl?: boolean;
    follow_redirects?: boolean;
  };
}

export interface MailRecipients {
  to: string;
  cc?: string;
  bcc?: string;
  reply_to?: string;
}

export interface NotificationSettings {
  on_success: boolean;
  on_failure: boolean;
  include_output: boolean;
  max_output_size?: number;
  custom_template?: string;
}

export interface ExecutionLog {
  executed_at: string;
  result: any;
  output?: string;
  error?: string;
  duration?: number;
}

export interface Task {
  uuid: string;
  task_name: string;
  cron_expression: string;
  command: Command | null;
  endpoint: Endpoint | null;
  is_command: boolean;
  is_request: boolean;
  launch_on_save: boolean;
  last_execution_date: string;
  last_execution_result: string;
  mail_recipients: MailRecipients | null;
  notification_settings?: NotificationSettings;
  state: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  created_by: string;
  created_at: string;
  execution_logs: ExecutionLog[] | null;
  tags?: string[];
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  timeout?: number;
  max_retries?: number;
  retry_delay?: number;
}