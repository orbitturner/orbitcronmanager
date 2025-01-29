import React from 'react';
import { Control, UseFormRegister, Controller } from 'react-hook-form';
import { Globe } from 'lucide-react';
import { MonacoWrapper } from '@/components/MonacoWrapper';
import { AuthConfig } from './AuthConfig';
import type { Task } from '@/types/task';

interface RequestConfigProps {
  register: UseFormRegister<Task>;
  control: Control<Task>;
  showAuthConfig: boolean;
  setShowAuthConfig: (show: boolean) => void;
}

export function RequestConfig({
  register,
  control,
  showAuthConfig,
  setShowAuthConfig,
}: RequestConfigProps) {
  const defaultHeaders = `{
  "Content-Type": "application/json"
}`;

  const defaultBody = `{
  
}`;

  const [method, setMethod] = React.useState('GET');

  return (
    <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          HTTP Request Configuration
        </h2>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                {...register('endpoint.url', { required: 'URL is required' })}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Method</label>
              <select
                {...register('endpoint.method')}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <AuthConfig
            register={register}
            control={control}
            showAuthConfig={showAuthConfig}
            setShowAuthConfig={setShowAuthConfig}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Headers</label>
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <Controller
                name="endpoint.headers"
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
          </div>

          {method !== 'GET' && (
            <div>
              <label className="block text-sm font-medium mb-1">Body</label>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <Controller
                  name="endpoint.data"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}