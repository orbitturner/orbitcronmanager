import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, Clock, CheckCircle, XCircle, Terminal, Calendar, Globe, Code } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform"
            >
              <div className="relative bg-background/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div>
                    <h2 className="text-xl font-semibold">{task.task_name}</h2>
                    <p className="text-sm text-gray-400 mt-1">Task Details & Execution History</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Task Information */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Task Configuration</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="text-sm">Schedule</span>
                            </div>
                            <span className="text-sm font-medium">{task.cron_expression}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {task.is_command ? (
                                <Code className="w-4 h-4 text-purple-400" />
                              ) : (
                                <Globe className="w-4 h-4 text-blue-400" />
                              )}
                              <span className="text-sm">Type</span>
                            </div>
                            <span className="text-sm font-medium">
                              {task.is_command ? 'Command' : 'HTTP Request'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">Status</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              task.state === 'ACTIVE'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-gray-500/10 text-gray-400'
                            }`}>
                              {task.state}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Execution Stats</h3>
                        <div className="space-y-4">
                          {task.execution_logs && (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Total Executions</span>
                                <span className="text-sm font-medium">
                                  {task.execution_logs.length}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Success Rate</span>
                                <span className="text-sm font-medium">
                                  {((task.execution_logs.filter(log => log.result === 'SUCCESS').length / 
                                    task.execution_logs.length) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Average Duration</span>
                                <span className="text-sm font-medium">
                                  {Math.round(
                                    task.execution_logs.reduce((acc, log) => acc + (log.duration || 0), 0) / 
                                    task.execution_logs.length
                                  )}ms
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Execution Logs */}
                    <div className="lg:col-span-2">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Execution History</h3>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                          {task.execution_logs?.map((log, index) => (
                            <div
                              key={index}
                              className="p-4 bg-black/20 rounded-lg space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {log.result === 'SUCCESS' ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-400" />
                                  )}
                                  <span className="text-sm font-medium">{log.result}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                  <Clock className="w-4 h-4" />
                                  <span>{format(new Date(log.executed_at), 'PPp')}</span>
                                </div>
                              </div>

                              {log.output && (
                                <div className="mt-2 p-3 bg-black/40 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Terminal className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-400">Output</span>
                                  </div>
                                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                    {log.output}
                                  </pre>
                                </div>
                              )}

                              {log.error && (
                                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                  <pre className="text-xs text-red-400 overflow-x-auto whitespace-pre-wrap">
                                    {log.error}
                                  </pre>
                                </div>
                              )}

                              {log.duration && (
                                <div className="flex items-center justify-end mt-2">
                                  <span className="text-xs text-gray-400">
                                    Duration: {log.duration}ms
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}