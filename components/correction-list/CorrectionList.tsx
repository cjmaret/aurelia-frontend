import React, { useState } from 'react';
import { FlatList, ActivityIndicator, Button } from 'react-native';
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
  isSearching,
  searchQuery,
}: {
  refreshControl?: React.ReactElement;
  handleScroll?: (event: any) => void;
  isSearching: boolean;
  searchQuery: string | null;
}) {
  const {
    correctionData,
    fetchCorrections,
    searchCorrections,
    pagination,
  } = useCorrectionsData();
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  console.log('isSearching:', isSearching);
  console.log('searchQuery:', searchQuery);
  console.log('pagination:', pagination);
  console.log('\n');

  const handleLoadMore = async () => {
    if (
      isLoadingMore ||
      pagination.page * pagination.limit >= pagination.total // no more data to fetch
    ) {
      return;
    }

    setIsLoadingMore(true);
    try {
      if (isSearching && searchQuery) {
        await searchCorrections({
          query: searchQuery,
          page: pagination.page + 1,
          limit: pagination.limit,
        });
      } else {
        await fetchCorrections({
          page: pagination.page + 1,
          limit: pagination.limit,
        });
      }
    } catch (error) {
      console.error('Error loading more corrections:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
