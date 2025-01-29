import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/lib/notiflix';

interface EmailPillsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EmailPills({ value, onChange, placeholder }: EmailPillsProps) {
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const emails = value ? value.split(',').filter(Boolean) : [];

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    
    if (!isValidEmail(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!emails.includes(trimmedEmail)) {
      onChange([...emails, trimmedEmail].join(','));
    }
    setInputValue('');
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(emails.filter(email => email !== emailToRemove).join(','));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedEmails = pastedText.split(/[,\s]+/);
    
    const validEmails = pastedEmails
      .map(email => email.trim())
      .filter(email => email && isValidEmail(email) && !emails.includes(email));

    if (validEmails.length > 0) {
      onChange([...emails, ...validEmails].join(','));
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="min-h-[42px] px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-primary transition-shadow flex flex-wrap gap-2 cursor-text"
    >
      <AnimatePresence>
        {emails.map((email) => (
          <motion.span
            key={email}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/30 text-sm group"
          >
            {email}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeEmail(email);
              }}
              className="p-0.5 rounded-full hover:bg-primary/30 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => {
          if (inputValue) {
            addEmail(inputValue);
          }
        }}
        placeholder={emails.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[200px] bg-transparent outline-none placeholder:text-gray-400"
      />
    </div>
  );
}