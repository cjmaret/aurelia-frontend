import React, { useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/utils/contexts/AuthContext';
import LanguageSelection from '../language-selection/LanguageSelection';
import { languages } from '@/constants/profileConstants';
import { Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';

export default function Setup() {
  const navigation = useNavigation();
  const { user, setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [appLanguage, setAppLanguage] = useState<string>('english');
  const [targetLanguage, setTargetLanguage] = useState<string>('english');

  const handleSave = async () => {
    try {
      const updatedUser = await api.updateUserDetails({
        appLanguage,
        targetLanguage,
        setupComplete: true,
      });

      setUser(updatedUser);
      Alert.alert('Success', 'Setup complete! You can now use the app.');
      router.navigate('/');
    } catch (error) {
      console.error('Error saving setup:', error);
      Alert.alert('Error', 'Failed to save setup. Please try again.');
    }
  };

  if (step === 1) {
    return (
      <LanguageSelection
        title="Setup Your Profile"
        subtitle="Select App Language:"
        languages={languages}
        selectedLanguage={appLanguage}
        onSelectLanguage={setAppLanguage}
        onNext={() => setStep(2)}
      />
    );
  }

  return (
    <LanguageSelection
      title="Setup Your Profile"
      subtitle="Select Target Language:"
      languages={languages}
      selectedLanguage={targetLanguage}
      onSelectLanguage={setTargetLanguage}
      onNext={handleSave}
      isFinalStep
    />
  );
}
