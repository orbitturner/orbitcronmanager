import React from 'react';
import { motion } from 'framer-motion';

interface CronBuilderProps {
  value: string;
  onChange: (value: string) => void;
}

export function CronBuilder({ value, onChange }: CronBuilderProps) {
  const [minute, setMinute] = React.useState('*');
  const [hour, setHour] = React.useState('*');
  const [dayOfMonth, setDayOfMonth] = React.useState('*');
  const [month, setMonth] = React.useState('*');
  const [dayOfWeek, setDayOfWeek] = React.useState('*');

  const updateCron = (field: string, newValue: string) => {
    let parts = value.split(' ');
    if (parts.length !== 5) parts = ['*', '*', '*', '*', '*'];

    switch (field) {
      case 'minute':
        parts[0] = newValue;
        setMinute(newValue);
        break;
      case 'hour':
        parts[1] = newValue;
        setHour(newValue);
        break;
      case 'dayOfMonth':
        parts[2] = newValue;
        setDayOfMonth(newValue);
        break;
      case 'month':
        parts[3] = newValue;
        setMonth(newValue);
        break;
      case 'dayOfWeek':
        parts[4] = newValue;
        setDayOfWeek(newValue);
        break;
    }

    onChange(parts.join(' '));
  };

  const presets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every Sunday at midnight', value: '0 0 * * 0' },
    { label: 'Every month on the 1st', value: '0 0 1 * *' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Minute</label>
          <select
            value={minute}
            onChange={(e) => updateCron('minute', e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="*">Every minute (*)</option>
            <option value="0">At minute 0</option>
            <option value="15">At minute 15</option>
            <option value="30">At minute 30</option>
            <option value="45">At minute 45</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hour</label>
          <select
            value={hour}
            onChange={(e) => updateCron('hour', e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="*">Every hour (*)</option>
            <option value="0">At midnight (0)</option>
            <option value="12">At noon (12)</option>
            {Array.from({ length: 24 }).map((_, i) => (
              <option key={i} value={i}>At {i}:00</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Day of Month</label>
          <select
            value={dayOfMonth}
            onChange={(e) => updateCron('dayOfMonth', e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="*">Every day (*)</option>
            {Array.from({ length: 31 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>On day {i + 1}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Month</label>
          <select
            value={month}
            onChange={(e) => updateCron('month', e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="*">Every month (*)</option>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
              <option key={i + 1} value={i + 1}>In {month}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Day of Week</label>
          <select
            value={dayOfWeek}
            onChange={(e) => updateCron('dayOfWeek', e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="*">Every day (*)</option>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
              <option key={i} value={i}>On {day}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <label className="block text-sm font-medium mb-2">Common Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                value === preset.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card hover:bg-primary/10'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}