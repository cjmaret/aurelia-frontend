import React, { useState } from 'react';
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
  ItalicText,
  CardHeaderTextContainer,
  CardHeaderTextTitle,
  CardHeaderTextTime,
  ErrorHeaderText,
  ContragulatoryTextContainer,
  ContragulatoryText,
  ErrorDetailHeader,
  ErrorDetailText,
  ErrorDetailContainer,
  HighlightedText,
} from './styledReviewCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { extractTime } from '@/utils/functions/extractTime';
import { getConversationTitle } from '@/utils/functions/getConversationTitle';
import { LinearGradient } from 'expo-linear-gradient';
import { CorrectionDataType } from '@/types/types';
import colors from '@/assets/globalStyles';

export default function ReviewCard({
  cardData,
}: {
  cardData: CorrectionDataType;
}) {
  const { createdAt, sentenceFeedback } = cardData;
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState<string[]>([]);

  const title = getConversationTitle(cardData.createdAt);

  const toggleCard = () => setIsCardExpanded((prev) => !prev);

  const toggleError = (errorId: string) => {
    setExpandedErrors((prevState) => {
      if (prevState.includes(errorId)) {
        return prevState.filter((id) => id !== errorId);
      } else {
        return [...prevState, errorId];
      }
    });
  };

  const getHighlightedText = (original: string, corrected: string) => {
    const normalizeWord = (word: string) => word.replace(/[.,!?;:]/g, '');

    const originalWords = new Set(original.split(/\s+/).map(normalizeWord)); 
    const correctedWords = corrected.split(/\s+/);

    return correctedWords.map((word, index) => {
      const normalizedWord = normalizeWord(word);
      if (!originalWords.has(normalizedWord)) {
        return <HighlightedText key={index}>{word} </HighlightedText>;
      }
      return `${word} `;
    });
  };

  return (
    <CardContainer>
      <TouchableOpacity onPress={toggleCard}>
        <CardHeader>
          <HeaderArrowIcon>
            <MaterialCommunityIcons
              name={isCardExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.cardHeaderText}
            />
          </HeaderArrowIcon>
          <CardHeaderTextContainer>
            <CardHeaderTextTitle>{title}</CardHeaderTextTitle>
            <CardHeaderTextTime>{extractTime(createdAt)}</CardHeaderTextTime>
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
                    <BoldText>You said:</BoldText> "{sentence.original}"
                  </OriginalText>
                  <CorrectedText>
                    <BoldText>Corrected:</BoldText> "{' '}
                    {getHighlightedText(sentence.original, sentence.corrected)}"
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
                        <TouchableOpacity onPress={() => toggleError(error.id)}>
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
                                  color={colors.snippetErrorText}
                                />
                              </ErrorArrowIcon>
                              <ErrorHeaderText>
                                <View>
                                  <ErrorDetailHeader>
                                    What's wrong:{' '}
                                  </ErrorDetailHeader>
                                  <ErrorDetailText>
                                    {error.error}
                                  </ErrorDetailText>
                                </View>
                              </ErrorHeaderText>
                            </ErrorHeader>
                          </View>
                        </TouchableOpacity>
                        {errorIsExpanded && (
                          <ErrorTextContainer>
                            <ErrorDetailContainer>
                              <ErrorDetailHeader>Why?</ErrorDetailHeader>
                              <ErrorDetailText>{error.reason}</ErrorDetailText>
                            </ErrorDetailContainer>
                            <ErrorDetailContainer>
                              <ErrorDetailHeader>
                                Try this instead:
                              </ErrorDetailHeader>
                              <ErrorDetailText>
                                {error.suggestion}
                              </ErrorDetailText>
                            </ErrorDetailContainer>
                            <ErrorDetailContainer style={{ marginBottom: 0 }}>
                              <ErrorDetailHeader>
                                Improved clause:
                              </ErrorDetailHeader>
                              <ErrorDetailText>
                                "{error.improvedClause}"
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
}
