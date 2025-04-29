import { useEffect } from 'react';
import { useAuth } from '@/utils/contexts/AuthContext';
import i18n from './i18n';

const LanguageUpdater = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.appLanguage) {
      i18n.changeLanguage(user.appLanguage);
    }
  }, [user?.appLanguage]);

  return <>{children}</>;
};

export default LanguageUpdater;
