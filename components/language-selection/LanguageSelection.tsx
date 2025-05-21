import React from 'react';
import { FlatList, Alert } from 'react-native';
import {
  Container,
  Title,
  Subtitle,
  LanguageButton,
  ButtonText,
  SaveButton,
  ListContainer,
  ButtonContainer,
  BackButton,
} from '../setup/styledSetup';
import { useTranslation } from 'react-i18next';
import { getTranslatedLanguageName } from '@/utils/functions/generalFunctions';
import { languageCodes } from '@/constants/profileConstants';
import { useToastModal } from '@/utils/contexts/ToastModalContext';

interface LanguageSelectionProps {
  title: string;
  subtitle: string;
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  showLanguagesInOwnLanguage?: boolean;
  onNext: () => void;
  onBack?: () => void;
  isFinalStep?: boolean;
}

export default function LanguageSelection({
  title,
  subtitle,
  selectedLanguage,
  showLanguagesInOwnLanguage,
  onSelectLanguage,
  onNext,
  onBack,
  isFinalStep,
}: LanguageSelectionProps) {
  const { showToast } = useToastModal();
  const { t } = useTranslation();

  const getLanguageName = ({ code }: { code: string }) => {
    if (showLanguagesInOwnLanguage) {
      switch (code) {
        case 'en':
          return 'English';
        case 'es':
          return 'Español';
        case 'fr':
          return 'Français';
        default:
          return code;
      }
    } else {
      return getTranslatedLanguageName({ code, t });
    }
  };

  const handleNext = () => {
    if (!selectedLanguage) {
      showToast('error', t('error'), t('pleaseSelectLanguage'));
      return;
    }
    onNext();
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <ListContainer>
        <FlatList
          data={languageCodes}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <LanguageButton
              onPress={() => onSelectLanguage(item.toLowerCase())}
              selected={selectedLanguage === item.toLowerCase()}>
              <ButtonText>{getLanguageName({ code: item })}</ButtonText>
            </LanguageButton>
          )}
        />
      </ListContainer>
      <ButtonContainer>
        {onBack && ( 
          <BackButton onPress={onBack}>
            <ButtonText>{t('Back')}</ButtonText>
          </BackButton>
        )}
        <SaveButton onPress={handleNext}>
          <ButtonText>{isFinalStep ? t('save') : 'Next'}</ButtonText>
        </SaveButton>
      </ButtonContainer>
    </Container>
  );
}
