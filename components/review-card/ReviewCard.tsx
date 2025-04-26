import React, { memo, useEffect, useState } from 'react';
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
} from './styledReviewCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CorrectionDataType } from '@/types/types';
import {
  formatTime,
  getConversationTitle,
} from '@/utils/functions/generalFunctions';
import { useTheme } from 'styled-components/native';

export default memo(function ReviewCard({
  cardData,
  searchQuery,
  collapseCardsAndErrors,
  setCollapseCardsAndErrors,
}: {
  cardData: CorrectionDataType;
  searchQuery: string;
  collapseCardsAndErrors: boolean;
  setCollapseCardsAndErrors: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const { createdAt, sentenceFeedback, conversationId } = cardData;
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState<string[]>([]);

  const title = getConversationTitle({ dateTimeString: cardData.createdAt });

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
        <>
          {word}
          {!isLastWord && ' '}
        </>
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
      const wordChildren = (word as React.ReactElement).props.children;
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
    <CardContainer key={conversationId}>
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
            <CardHeaderTextTitle>{title}</CardHeaderTextTitle>
            <CardHeaderTextTime>
              {formatTime({ dateTimeString: createdAt })}
            </CardHeaderTextTime>
          </CardHeaderTextContainer>
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
                    <BoldText>You said:</BoldText> "
                    {highlightSearchedText(sentence.original)}"
                  </OriginalText>
                  <CorrectedText>
                    <BoldText>Corrected:</BoldText> "
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
                    <BoldText>You said:</BoldText> "{sentence.corrected}"
                  </CorrectedText>
                  <ContragulatoryTextContainer>
                    <ContragulatoryText>
                      🎊 Great job! No errors! 🎊
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
                                    What's wrong:{' '}
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
                              <ErrorDetailHeader>Why?</ErrorDetailHeader>
                              <ErrorDetailText>
                                {highlightSearchedText(error.reason)}
                              </ErrorDetailText>
                            </ErrorDetailContainer>
                            <ErrorDetailContainer>
                              <ErrorDetailHeader>
                                Try this instead:
                              </ErrorDetailHeader>
                              <ErrorDetailText>
                                {highlightSearchedText(error.suggestion)}
                              </ErrorDetailText>
                            </ErrorDetailContainer>
                            <ErrorDetailContainer style={{ marginBottom: 0 }}>
                              <ErrorDetailHeader>
                                Improved clause:
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
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0.9)',
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
    </CardContainer>
  );
});
