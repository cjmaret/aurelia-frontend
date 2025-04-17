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
} from '../setup/styledSetup';

interface LanguageSelectionProps {
  title: string;
  subtitle: string;
  languages: string[];
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  onNext: () => void;
  isFinalStep?: boolean;
}

export default function LanguageSelection({
  title,
  subtitle,
  languages,
  selectedLanguage,
  onSelectLanguage,
  onNext,
  isFinalStep = false,
}: LanguageSelectionProps) {
  const handleNext = () => {
    if (!selectedLanguage) {
      Alert.alert('Error', 'Please select a language.');
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
          data={languages}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <LanguageButton
              onPress={() => onSelectLanguage(item.toLowerCase())}
              selected={selectedLanguage === item.toLowerCase()}>
              <ButtonText>{item}</ButtonText>
            </LanguageButton>
          )}
        />
      </ListContainer>
      <SaveButton onPress={handleNext}>
        <ButtonText>{isFinalStep ? 'Save' : 'Next'}</ButtonText>
      </SaveButton>
    </Container>
  );
}
