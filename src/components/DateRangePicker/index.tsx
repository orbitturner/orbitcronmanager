import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
  className?: string;
}

export function DateRangePicker({ startDate, endDate, onChange, className = '' }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      onChange([date, null]);
    } else {
      if (date < startDate) {
        onChange([date, startDate]);
      } else {
        onChange([startDate, date]);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }
    return false;
  };

  const displayValue = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
    }
    if (startDate) {
      return format(startDate, 'dd/MM/yyyy');
    }
    return 'Select date range';
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center cursor-pointer"
      >
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          readOnly
          value={displayValue()}
          className="w-full pl-9 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm cursor-pointer"
          placeholder="Select date range"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="z-50 mt-2 p-4 bg-card border border-white/10 rounded-lg shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-medium">
                {format(currentDate, 'MMMM yyyy', { locale: fr })}
              </span>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
                <div key={day} className="text-center text-sm text-gray-400 py-1">
                  {day}
                </div>
              ))}

              {Array.from({ length: startOfMonth(currentDate).getDay() - 1 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {days.map((day) => {
                const isSelected = startDate && endDate ? isInRange(day) : startDate ? isSameDay(startDate, day) : false;
                const isRangeStart = startDate && isSameDay(startDate, day);
                const isRangeEnd = endDate && isSameDay(endDate, day);

                return (
                  <button
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    className={`
                      relative p-2 text-sm rounded-lg transition-colors
                      ${!isSameMonth(day, currentDate) ? 'text-gray-500' : ''}
                      ${isSelected ? 'bg-primary/20 text-primary' : 'hover:bg-white/5'}
                      ${isToday(day) ? 'font-semibold' : ''}
                      ${isRangeStart ? 'rounded-r-none' : ''}
                      ${isRangeEnd ? 'rounded-l-none' : ''}
                    `}
                  >
                    {format(day, 'd')}
                    {isSelected && !isRangeStart && !isRangeEnd && (
                      <div className="absolute inset-0 bg-primary/10 -z-10" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  onChange([null, null]);
                  setIsOpen(false);
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}