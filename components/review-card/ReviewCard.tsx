import React, { isValidElement, memo, useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {
  CardContainer,
  HeaderArrowIcon,
  CardHeader,
  CardContent,
  ErrorTextContainer,
  SnippetCard,
  OriginalValueText,
  ErrorList,
  CardHeaderTextContainer,
  CardHeaderTextTitle,
  CardHeaderTextTime,
  ContragulatoryTextContainer,
  ContragulatoryText,
  ErrorDetailHeader,
  ErrorDetailText,
  ErrorDetailContainer,
  HighlightedCorrectedText,
  HighlightedSearchText,
  DeleteButton,
  CorrectionCountText,
  SnippetContentHeaderLabelContainer,
  OriginalItem,
  OriginalLabelText,
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
import SnippetItem from '../snippet-item/SnippetItem';

export default memo(
  function ReviewCard({
    cardData,
    searchQuery,
    collapseCardsAndErrors,
    setCollapseCardsAndErrors,
    handleDeleteCard,
    handleDeleteCorrection,
    isDeleting,
  }: {
    cardData: ConversationDataType;
    searchQuery: string;
    collapseCardsAndErrors: boolean;
    setCollapseCardsAndErrors: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteCard: (conversationId: string) => void;
    handleDeleteCorrection: (
      conversationId: string,
      correctionId: string
    ) => void;
    isDeleting?: boolean;
  }) {
    const theme: any = useTheme();
    const { t } = useTranslation();
    const { createdAt, sentenceFeedback } = cardData;
    const [isCardExpanded, setIsCardExpanded] = useState(false);
    const [expandedErrors, setExpandedErrors] = useState<string[]>([]);

    const title = getConversationTitle({
      dateTimeString: cardData.createdAt,
      t,
    });

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
      const normalizeWord = (word: string) =>
        normalizeText(word.replace(/[.,!?;:]/g, ''));

      const originalWords = original.split(/\s+/).map(normalizeWord);
      const correctedWords = corrected.split(/\s+/);

      // build longest common subsequence table
      const m = originalWords.length;
      const n = correctedWords.length;
      const lcs: number[][] = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));

      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (originalWords[i] === normalizeWord(correctedWords[j])) {
            lcs[i + 1][j + 1] = lcs[i][j] + 1;
          } else {
            lcs[i + 1][j + 1] = Math.max(lcs[i + 1][j], lcs[i][j + 1]);
          }
        }
      }

      // find which correctedWords are in the lcs
      let i = m,
        j = n;
      const inLCS = Array(n).fill(false);
      while (i > 0 && j > 0) {
        if (originalWords[i - 1] === normalizeWord(correctedWords[j - 1])) {
          inLCS[j - 1] = true;
          i--;
          j--;
        } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
          i--;
        } else {
          j--;
        }
      }

      // highlight words not in lcs
      return correctedWords.map((word, idx) => {
        const isLastWord = idx === correctedWords.length - 1;
        if (inLCS[idx]) {
          return (
            <React.Fragment key={idx}>
              {word}
              {!isLastWord && ' '}
            </React.Fragment>
          );
        } else {
          return (
            <HighlightedCorrectedText key={idx}>
              {word}
              {!isLastWord && ' '}
            </HighlightedCorrectedText>
          );
        }
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
            <CardHeaderTextContainer>
              <CardHeaderTextTitle>{title}</CardHeaderTextTitle>
              <CardHeaderTextTime>
                {formatTime({ dateTimeString: createdAt })}
              </CardHeaderTextTime>
              <HeaderArrowIcon>
                <MaterialCommunityIcons
                  name={isCardExpanded ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={theme.colors.textSecondary}
                />
              </HeaderArrowIcon>
            </CardHeaderTextContainer>
            <DeleteButton
              onPress={() => handleDeleteCard(cardData.conversationId)}>
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
            {sentenceFeedback.length > 1 && (
              <CorrectionCountText>
                {t('sentencesInThisConversation', {
                  count: sentenceFeedback.length,
                })}
              </CorrectionCountText>
            )}
            {sentenceFeedback.map((sentence) => (
              <SnippetCard key={sentence.id}>
                {isCardExpanded && sentenceFeedback.length > 1 && (
                  <DeleteButton
                    onPress={() =>
                      handleDeleteCorrection(
                        cardData.conversationId,
                        sentence.id
                      )
                    }>
                    <MaterialCommunityIcons
                      name="close"
                      size={14}
                      color={theme.colors.textSecondary}
                    />
                  </DeleteButton>
                )}
                {sentence?.errors?.length > 0 ? (
                  <>
                    <OriginalItem>
                      <SnippetContentHeaderLabelContainer>
                        <OriginalLabelText>{t('youSaid')}:</OriginalLabelText>
                      </SnippetContentHeaderLabelContainer>
                      <OriginalValueText>
                        {highlightSearchedText(sentence.original)}
                      </OriginalValueText>
                    </OriginalItem>
                    <SnippetItem
                      variant="corrected"
                      sentence={sentence}
                      combinedHighlightedText={combinedHighlightedText}
                    />
                  </>
                ) : (
                  <>
                    <SnippetItem
                      variant="youSaid"
                      sentence={sentence}
                      combinedHighlightedText={combinedHighlightedText}
                    />
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
                        <SnippetItem
                          key={error.id}
                          variant="error"
                          sentence={sentence}
                          combinedHighlightedText={combinedHighlightedText}
                          highlightSearchedText={highlightSearchedText}
                          error={error}
                          isExpanded={errorIsExpanded}
                          onToggle={() => toggleExpandError(error.id)}>
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
                        </SnippetItem>
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
  },
  // comparison func, only rerender if card data or state changes
  (prevProps, nextProps) => {
    return (
      prevProps.cardData === nextProps.cardData &&
      prevProps.searchQuery === nextProps.searchQuery &&
      prevProps.isDeleting === nextProps.isDeleting
    );
  }
);
