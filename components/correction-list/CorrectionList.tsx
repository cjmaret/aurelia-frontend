import React, { useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
  NativeScrollEvent,
  View,
  Alert,
} from 'react-native';
import ReviewCard from '../review-card/ReviewCard';
import { isSameDay } from 'date-fns';
import { CorrectionDataType } from '@/types/types';
import {
  DateSeparatorContainer,
  DateSeparatorLine,
  DateSeparatorText,
  ReviewCardContainer,
} from './styledCorrectionList';
import {
  formatDate,
  formatToLocalDate,
} from '@/utils/functions/generalFunctions';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import type { RefreshControlProps } from 'react-native';
import SkeletonReviewCard from '../review-card-skeleton.tsx/SkeletonReviewCard';

export default function CorrectionList({
  searchQuery,
  refreshControl,
  handleScroll,
  handleLoadMore,
  isLoadingMoreCards,
  collapseCardsAndErrors,
  setCollapseCardsAndErrors,
}: {
  searchQuery: string;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  handleScroll?: (event: React.BaseSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  isLoadingMoreCards: boolean;
  collapseCardsAndErrors: boolean;
  setCollapseCardsAndErrors: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useCorrectionsData();
  const theme: any = useTheme();
  const { showToast } = useToastModal();
  const { t } = useTranslation();
  const { correctionData, deleteCorrection, isProcessingRecording } =
    useCorrectionsData();
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const handleDeleteCard = async (conversationId: string) => {
    Alert.alert(
      t('confirmDeleteTitle'),
      t('confirmDeleteMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            setDeletingCardId(conversationId);
            try {
              await deleteCorrection(conversationId);
            } catch (error: any) {
              showApiErrorToast({
                error,
                showToast,
                t,
              });
            } finally {
              setDeletingCardId(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderCard = ({
    item: cardData,
    index,
    collapseCardsAndErrors,
    setCollapseCardsAndErrors,
  }: {
    item: CorrectionDataType;
    index: number;
    collapseCardsAndErrors: boolean;
    setCollapseCardsAndErrors: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const currentDateLocal = formatToLocalDate({
      dateTimeString: cardData.createdAt,
    });

    const previousDateLocal =
      index > 0
        ? formatToLocalDate({
            dateTimeString: correctionData[index - 1].createdAt,
          })
        : null;

    const showDateSeparator =
      !previousDateLocal || !isSameDay(currentDateLocal, previousDateLocal);

    return (
      <ReviewCardContainer>
        {showDateSeparator && (
          <DateSeparatorContainer>
            <DateSeparatorLine />
            <DateSeparatorText
              maxFontSizeMultiplier={2}
              numberOfLines={2}>
              {formatDate({
                dateTimeString: cardData.createdAt,
              })}
            </DateSeparatorText>
          </DateSeparatorContainer>
        )}
        <ReviewCard
          cardData={cardData}
          searchQuery={searchQuery}
          collapseCardsAndErrors={collapseCardsAndErrors}
          setCollapseCardsAndErrors={setCollapseCardsAndErrors}
          handleDeleteCard={() => handleDeleteCard(cardData.conversationId)}
          isDeleting={deletingCardId === cardData.conversationId}
        />
      </ReviewCardContainer>
    );
  };

  return (
    // dont cut off final cards if height changes dynamically
    <View style={{ flex: 1 }}>
      <FlatList
        data={correctionData}
        keyExtractor={(item) => item.conversationId}
        renderItem={({ item, index }) =>
          renderCard({
            item,
            index,
            collapseCardsAndErrors,
            setCollapseCardsAndErrors,
          })
        } // renders each item (card)
        onEndReached={handleLoadMore} // fetch more data when scrolled to the bottom
        onEndReachedThreshold={0.5} // fetch when 50% to the bottom
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
        extraData={correctionData}
        ListHeaderComponent={
          isProcessingRecording ? <SkeletonReviewCard /> : null
        }
        ListFooterComponent={
          isLoadingMoreCards ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : null
        } // spinner at the bottom
      />
    </View>
  );
}
