import React from 'react';
import { FlatList, ActivityIndicator, NativeScrollEvent } from 'react-native';
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
import colors from '@/assets/globalStyles';

export default function CorrectionList({
  refreshControl,
  handleScroll,
  handleLoadMore,
  isLoadingMore,
}: {
  refreshControl?: React.ReactElement;
  handleScroll?: (event: React.BaseSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  isLoadingMore: boolean;
}) {
  const { correctionData } = useCorrectionsData();

  const renderCard = ({
    item: cardData,
    index,
  }: {
    item: CorrectionDataType;
    index: number;
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
      <ReviewCardContainer key={index}>
        {showDateSeparator && (
          <DateSeparatorContainer>
            <DateSeparatorLine />
            <DateSeparatorText>
              {formatDate({ dateTimeString: cardData.createdAt })}
            </DateSeparatorText>
          </DateSeparatorContainer>
        )}
        <ReviewCard cardData={cardData} />
      </ReviewCardContainer>
    );
  };

  return (
    <FlatList
      data={correctionData}
      keyExtractor={(item) => item.conversationId} // provides unique key for each item
      renderItem={renderCard} // renders each item (card)
      onEndReached={handleLoadMore} // fetch more data when scrolled to the bottom
      onEndReachedThreshold={0.5} // fetch when 50% to the bottom
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={refreshControl}
      ListFooterComponent={
        isLoadingMore ? (
          <ActivityIndicator size="small" color={colors.textSecondary} />
        ) : null
      } // spinner at the bottom
    />
  );
}
