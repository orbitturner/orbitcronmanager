import React from 'react';
import { Control, UseFormRegister, Controller } from 'react-hook-form';
import { Lock } from 'lucide-react';
import { MonacoWrapper } from '@/components/MonacoWrapper';
import type { Task } from '@/types/task';

interface AuthConfigProps {
  register: UseFormRegister<Task>;
  control: Control<Task>;
  showAuthConfig: boolean;
  setShowAuthConfig: (show: boolean) => void;
}

export function AuthConfig({
  register,
  control,
  showAuthConfig,
  setShowAuthConfig,
}: AuthConfigProps) {
  const defaultHeaders = `{
  "Content-Type": "application/json"
}`;

  const defaultBody = `{
  
}`;

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Authentication
        </h3>
        <button
          type="button"
          onClick={() => setShowAuthConfig(!showAuthConfig)}
          className="text-sm text-primary hover:text-primary/80"
        >
          {showAuthConfig ? 'Hide Authentication' : 'Configure Authentication'}
        </button>
      </div>

      {showAuthConfig && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Auth Request URL</label>
            <input
              {...register('endpoint.auth_request.url')}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://api.example.com/auth"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Auth Request Headers</label>
            <Controller
              name="endpoint.auth_request.headers"
              control={control}
              render={({ field }) => (
                <MonacoWrapper
                  value={field.value || defaultHeaders}
                  onChange={field.onChange}
                  language="json"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Auth Request Body</label>
            <Controller
              name="endpoint.auth_request.data"
              control={control}
              render={({ field }) => (
                <MonacoWrapper
                  value={field.value || defaultBody}
                  onChange={field.onChange}
                  language="json"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Token Field</label>
            <input
              {...register('endpoint.auth_request.token_field')}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="access_token"
            />
            <p className="text-sm text-gray-400 mt-1">
              Field name in the auth response containing the token
            </p>
          </div>
        </div>
      )}
    </div>
  );
}