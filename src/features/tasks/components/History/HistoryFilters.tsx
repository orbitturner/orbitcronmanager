import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Select } from '@/components/Select';
import { DateRangePicker } from '@/components/DateRangePicker';

interface HistoryFiltersProps {
  filters: {
    dateRange: [Date | null, Date | null];
    status: string[];
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function HistoryFilters({ filters, onFiltersChange }: HistoryFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'failure', label: 'Failure' },
    { value: 'pending', label: 'Pending' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-lg lg:rounded-xl p-4 lg:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-[1]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="relative z-[100]">
            <Select
              value={filters.status[0] || 'all'}
              onChange={(value) => onFiltersChange({ ...filters, status: [value] })}
              options={statusOptions}
              searchable
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <DateRangePicker
            startDate={filters.dateRange[0]}
            endDate={filters.dateRange[1]}
            onChange={(dates) => onFiltersChange({ ...filters, dateRange: dates })}
          />
        </div>
      </div>
    </motion.div>
  );
}