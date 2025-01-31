import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}

export function Select({ value, onChange, options, placeholder = 'Select...', className = '', searchable = false }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const ref = React.useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all ${className}`}
      >
        <span className={`${!selectedOption ? 'text-gray-400' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ zIndex: 1000 }}
            className="w-[var(--radix-select-trigger-width)] mt-2 bg-card border border-white/10 rounded-lg shadow-xl overflow-hidden"
          >
            {searchable && (
              <div className="p-2 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center px-4 py-2.5 hover:bg-white/5 transition-colors ${
                    option.value === value ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  <span className="flex-1 text-left">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 ml-2" />
                  )}
                </button>
              ))}

              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}