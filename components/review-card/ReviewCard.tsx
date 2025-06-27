import React, { isValidElement, memo, useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {
  CardContainer,
  HeaderArrowIcon,
  ErrorArrowIcon,
  CardHeader,
  CardContent,
  ErrorTextContainer,
  SnippetCard,
  OriginalText,
  CorrectedText,
  ErrorList,
  ErrorItem,
  ErrorHeader,
  BoldText,
  CardHeaderTextContainer,
  CardHeaderTextTitle,
  CardHeaderTextTime,
  ErrorHeaderText,
  ContragulatoryTextContainer,
  ContragulatoryText,
  ErrorDetailHeader,
  ErrorDetailText,
  ErrorDetailContainer,
  HighlightedCorrectedText,
  HighlightedSearchText,
  ErrorWhatsWongText,
  DeleteButton,
} from './styledReviewCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ConversationDataType } from '@/types/types';
import {
  formatTime,
  getConversationTitle,
} from '@/utils/functions/generalFunctions';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';

export default memo(function ReviewCard({
  cardData,
  searchQuery,
  collapseCardsAndErrors,
  setCollapseCardsAndErrors,
  handleDeleteCard,
  isDeleting,
}: {
  cardData: ConversationDataType;
  searchQuery: string;
  collapseCardsAndErrors: boolean;
  setCollapseCardsAndErrors: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteCard: () => void;
  isDeleting?: boolean;
}) {
  const theme: any = useTheme();
  const { t } = useTranslation();
  const { createdAt, sentenceFeedback } = cardData;
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState<string[]>([]);

  const title = getConversationTitle({ dateTimeString: cardData.createdAt, t });

  const toggleExpandCard = () => setIsCardExpanded((prev) => !prev);

  const toggleExpandError = (errorId: string) => {
    setExpandedErrors((prevState) => {
      if (prevState.includes(errorId)) {
        return prevState.filter((id) => id !== errorId);
      } else {
        return [...prevState, errorId];
      }
    });
  };

  useEffect(() => {
    if (collapseCardsAndErrors) {
      setIsCardExpanded(false);
      setExpandedErrors([]);
      setCollapseCardsAndErrors(false);
    }
  }, [collapseCardsAndErrors]);

  const normalizeText = (text: string) => {
    return text
      .trim()
      .replace(/[’‘‛′]/g, "'")
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .normalize('NFC');
  };

  const highlightCorrectedText = (original: string, corrected: string) => {
    // remove punctuation
    const normalizeWord = (word: string) =>
      normalizeText(word.replace(/[.,!?;:]/g, ''));

    // split by whitespace
    const originalWords = new Set(original.split(/\s+/).map(normalizeWord));
    const correctedWords = corrected.split(/\s+/);

    return correctedWords.map((word, index) => {
      const normalizedWord = normalizeWord(word);
      const isLastWord = index === correctedWords.length - 1;

      if (!originalWords.has(normalizedWord)) {
        return (
          <HighlightedCorrectedText key={index}>
            {word}
            {!isLastWord && ' '}
          </HighlightedCorrectedText>
        );
      }

      return (
        <React.Fragment key={index}>
          {word}
          {!isLastWord && ' '}
        </React.Fragment>
      );
    });
  };

  const highlightSearchedText = (text: string) => {
    if (!searchQuery.trim()) return text;

    const normalizedSearchQuery = normalizeText(searchQuery);

    // split searchQuery into individual words and escape special characters
    const escapedWords = normalizedSearchQuery
      .trim()
      .split(/\s+/) // split by whitespace
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    // regex to match any of the words
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');

    // wrap matches in the styled component
    return text
      .split(regex)
      .map((part, index) =>
        regex.test(part) ? (
          <HighlightedSearchText key={index}>{part}</HighlightedSearchText>
        ) : (
          part
        )
      );
  };

  const combinedHighlightedText = (original: string, corrected: string) => {
    const correctedHighlight = highlightCorrectedText(original, corrected);

    if (!searchQuery.trim()) {
      return correctedHighlight;
    }

    const normalizedSearchQuery = normalizeText(searchQuery);

    const escapedWords = normalizedSearchQuery
      .trim()
      .split(/\s+/)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');

    return correctedHighlight.map((word, index) => {
      if (typeof word === 'string') {
        return highlightSearchedText(word);
      }

      // since the text comes in as JSX, need to extract it
      const wordChildren = isValidElement(word)
        ? (word as React.ReactElement<any>).props.children
        : word;
      const wordText = Array.isArray(wordChildren)
        ? wordChildren.filter((child) => typeof child === 'string').join('')
        : wordChildren;

      const normalizedWordText = normalizeText(wordText);

      if (normalizedWordText.match(regex)) {
        return (
          <HighlightedSearchText key={index}>{word}</HighlightedSearchText>
        );
      }

      return word;
    });
  };

  return (
    <CardContainer>
      <TouchableOpacity onPress={toggleExpandCard}>
        <CardHeader>
          <HeaderArrowIcon>
            <MaterialCommunityIcons
              name={isCardExpanded ? 'chevron-up' : 'chevron-down'}
              size={25}
              color={theme.colors.cardHeaderText}
            />
          </HeaderArrowIcon>
          <CardHeaderTextContainer>
            <CardHeaderTextTitle maxFontSizeMultiplier={2} numberOfLines={2}>
              {title}
            </CardHeaderTextTitle>
            <CardHeaderTextTime maxFontSizeMultiplier={2} numberOfLines={2}>
              {formatTime({ dateTimeString: createdAt })}
            </CardHeaderTextTime>
          </CardHeaderTextContainer>
          <DeleteButton onPress={handleDeleteCard}>
            <MaterialCommunityIcons
              name="close"
              size={14}
              color={theme.colors.textSecondary}
            />
          </DeleteButton>
        </CardHeader>
      </TouchableOpacity>
      <View
        style={{
          maxHeight: isCardExpanded ? undefined : 150,
          overflow: 'hidden',
        }}>
        <CardContent>
          {sentenceFeedback.map((sentence) => (
            <SnippetCard key={sentence.id}>
              {sentence?.errors?.length > 0 ? (
                <>
                  <OriginalText>
                    <BoldText>{t('youSaid')}:</BoldText> "
                    {highlightSearchedText(sentence.original)}"
                  </OriginalText>
                  <CorrectedText key={sentence.id}>
                    <BoldText>{t('corrected')}:</BoldText> "
                    {combinedHighlightedText(
                      sentence.original,
                      sentence.corrected
                    )}
                    "
                  </CorrectedText>
                </>
              ) : (
                <>
                  <CorrectedText>
                    <BoldText>{t('youSaid')}:</BoldText> "
                    {highlightSearchedText(sentence.corrected)}"
                  </CorrectedText>
                  <ContragulatoryTextContainer>
                    <ContragulatoryText>
                      {t('greatJobNoErrors')}
                    </ContragulatoryText>
                  </ContragulatoryTextContainer>
                </>
              )}

              {sentence?.errors?.length > 0 && (
                <ErrorList>
                  {sentence.errors.map((error) => {
                    let errorIsExpanded = expandedErrors.includes(error.id);
                    return (
                      <ErrorItem key={error.id}>
                        <TouchableOpacity
                          onPress={() => toggleExpandError(error.id)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <ErrorHeader>
                              <ErrorArrowIcon>
                                <MaterialCommunityIcons
                                  name={
                                    errorIsExpanded
                                      ? 'chevron-up'
                                      : 'chevron-down'
                                  }
                                  size={25}
                                  color={theme.colors.snippetErrorText}
                                />
                              </ErrorArrowIcon>
                              <ErrorHeaderText>
                                <View>
                                  <ErrorDetailHeader>
                                    {t('whatsWrong')}:{' '}
                                  </ErrorDetailHeader>
                                  <ErrorWhatsWongText>
                                    {highlightSearchedText(error.error)}
                                  </ErrorWhatsWongText>
                                </View>
                              </ErrorHeaderText>
                            </ErrorHeader>
                          </View>
                        </TouchableOpacity>
                        {errorIsExpanded && (
                          <ErrorTextContainer>
                            <ErrorDetailContainer>
                              <ErrorDetailHeader>{t('why')}</ErrorDetailHeader>
                              <ErrorDetailText>
                                {highlightSearchedText(error.reason)}
                              </ErrorDetailText>
                            </ErrorDetailContainer>
                            <ErrorDetailContainer>
                              <ErrorDetailHeader>
                                {t('tryThisInstead')}:
                              </ErrorDetailHeader>
                              <ErrorDetailText>
                                {highlightSearchedText(error.suggestion)}
                              </ErrorDetailText>
                            </ErrorDetailContainer>
                            <ErrorDetailContainer style={{ marginBottom: 0 }}>
                              <ErrorDetailHeader>
                                {t('improvedClause')}:
                              </ErrorDetailHeader>
                              <ErrorDetailText>
                                "{highlightSearchedText(error.improvedClause)}"
                              </ErrorDetailText>
                            </ErrorDetailContainer>
                          </ErrorTextContainer>
                        )}
                      </ErrorItem>
                    );
                  })}
                </ErrorList>
              )}
            </SnippetCard>
          ))}
        </CardContent>
      </View>
      {!isCardExpanded && (
        <TouchableWithoutFeedback onPress={() => setIsCardExpanded(true)}>
          <LinearGradient
            colors={[
              theme.colors.cardShadowTopGradient,
              theme.colors.cardShadowTopGradient,
              theme.colors.cardShadowBottomGradient,
            ]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '72%',
              borderRadius: 12,
            }}
          />
        </TouchableWithoutFeedback>
      )}
      {isDeleting && <LoadingSpinner />}
    </CardContainer>
  );
});
