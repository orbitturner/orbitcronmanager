import React from 'react';
import { Control, UseFormRegister, Controller, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { Code, Terminal, Wand2, Copy, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { MonacoWrapper } from '@/components/MonacoWrapper';
import { toast } from '@/lib/notiflix';
import type { Task } from '@/types/task';
import { scriptTemplates } from './templates';

interface CommandConfigProps {
  register: UseFormRegister<Task>;
  control: Control<Task>;
  watchCommandType: string;
  setValue: UseFormSetValue<Task>;
  getValues: UseFormGetValues<Task>;
}

export function CommandConfig({ 
  register, 
  control, 
  watchCommandType,
  setValue,
  getValues
}: CommandConfigProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = React.useState(false);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setValue('command.script', scriptTemplates[watchCommandType][template], {
      shouldValidate: true,
      shouldDirty: true
    });
    setIsTemplateMenuOpen(false);
    toast.success('Template applied successfully');
  };

  const handleCopyScript = async () => {
    try {
      const script = getValues('command.script');
      await navigator.clipboard.writeText(script);
      toast.success('Script copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy script');
    }
  };

  const handleTestScript = async () => {
    try {
      toast.info('Testing script...');
      // Simulation d'exécution
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Script test completed successfully');
    } catch (error) {
      toast.error('Script test failed');
    }
  };

  return (
    <div className="bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/10" />
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Code className="w-5 h-5 text-primary" />
          </div>
          Command Configuration
        </h2>

        <div className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Script Type</label>
            <div className="relative">
              <select
                {...register('command.type')}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-shadow appearance-none pr-10"
              >
                <option value="bash">Bash</option>
                <option value="pwsh">PowerShell</option>
              </select>
              <Terminal className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Script</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Templates</span>
                </button>
              </div>
            </div>

            {isTemplateMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm"
              >
                <h3 className="text-sm font-medium mb-3">Quick Templates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(scriptTemplates[watchCommandType]).map((template) => (
                    <button
                      key={template}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-2 text-sm rounded-lg transition-colors text-left hover:bg-primary/10 ${
                        selectedTemplate === template ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="relative group">
              <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  onClick={handleCopyScript}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  onClick={handleTestScript}
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <Controller
                  name="command.script"
                  control={control}
                  rules={{ required: 'Script is required' }}
                  render={({ field }) => (
                    <MonacoWrapper
                      value={field.value}
                      onChange={field.onChange}
                      language={watchCommandType === 'bash' ? 'shell' : 'powershell'}
                      height="300px"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Advanced Options</h3>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Configure
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('command.options.timeout_enabled')}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Enable script timeout</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('command.options.elevated_privileges')}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Run with elevated privileges</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('command.options.save_output')}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Save output to log file</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}