import { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/utils/contexts/AuthContext';
import LanguageSelection from '../language-selection/LanguageSelection';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/utils/app-language-wrapper/i18n';
import { useToastModal } from '@/utils/contexts/ToastModalContext';

export default function Setup() {
  const { setUser } = useAuth();
  const { showToast } = useToastModal();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [appLanguage, setAppLanguage] = useState<string>('en');
  const [targetLanguage, setTargetLanguage] = useState<string>('en');

  const handleSave = async () => {
    try {
      const updatedUser = await api.updateUserDetails({
        appLanguage,
        targetLanguage,
        setupComplete: true,
      });

      setUser(updatedUser);
      showToast('success', t('success'), t('setupComplete'));
      router.navigate('/');
    } catch (error) {
      console.error('Error saving setup:', error);
      showToast('error', t('error'), t('setupFailed'));
    }
  };

  const moveToNextStep = () => {
    i18n.changeLanguage(appLanguage);
    setStep(2);
  };

  const moveToPreviousStep = () => {
    setStep(1); 
  };

  if (step === 1) {
    return (
      <LanguageSelection
        title="Set up Your Profile"
        subtitle="Choose the language you want your app to be in:"
        selectedLanguage={appLanguage}
        onSelectLanguage={setAppLanguage}
        showLanguagesInOwnLanguage
        onNext={moveToNextStep}
      />
    );
  }

  return (
    <LanguageSelection
      title={t('setupProfile')}
      subtitle={`${t('chooseTargetLanguage')}:`}
      selectedLanguage={targetLanguage}
      onSelectLanguage={setTargetLanguage}
      onNext={handleSave}
      onBack={moveToPreviousStep}
      isFinalStep
    />
  );
}
