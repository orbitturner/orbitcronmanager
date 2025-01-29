import { Notify } from 'notiflix';

// Configure Notiflix
Notify.init({
  position: 'right-top',
  distance: '15px',
  borderRadius: '8px',
  timeout: 3000,
  showOnlyTheLastOne: true,
  cssAnimation: true,
  cssAnimationDuration: 300,
  cssAnimationStyle: 'fade',
  useIcon: true,
  fontSize: '14px',
  clickToClose: true,
  pauseOnHover: true,
  
  success: {
    background: '#3B82F6',
    textColor: '#FFFFFF',
  },
  failure: {
    background: '#EF4444',
    textColor: '#FFFFFF',
  },
  warning: {
    background: '#F59E0B',
    textColor: '#FFFFFF',
  },
  info: {
    background: '#3B82F6',
    textColor: '#FFFFFF',
  },
});

export const toast = {
  success: (message: string) => Notify.success(message),
  error: (message: string) => Notify.failure(message),
  warning: (message: string) => Notify.warning(message),
  info: (message: string) => Notify.info(message),
};