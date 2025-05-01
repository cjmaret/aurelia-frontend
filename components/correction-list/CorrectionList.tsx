import React from 'react';
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

export default function CorrectionList({
  searchQuery,
  refreshControl,
  handleScroll,
  handleLoadMore,
  isLoadingMore,
  collapseCardsAndErrors,
  setCollapseCardsAndErrors,
}: {
  searchQuery: string;
  refreshControl?: React.ReactElement;
  handleScroll?: (event: React.BaseSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  isLoadingMore: boolean;
  collapseCardsAndErrors: boolean;
  setCollapseCardsAndErrors: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { correctionData, deleteCorrection } = useCorrectionsData();
  const theme = useTheme();
  const { t } = useTranslation();

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
            try {
              await deleteCorrection(conversationId);
            } catch (error) {
              Alert.alert(t('deleteError'), t('deleteErrorMessage'));
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
      <ReviewCardContainer key={cardData.conversationId.toString()}>
        {showDateSeparator && (
          <DateSeparatorContainer>
            <DateSeparatorLine />
            <DateSeparatorText>
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
        />
      </ReviewCardContainer>
    );
  };

  return (
    // dont cut off final cards if height changes dynamically
    <View style={{ flex: 1 }}>
      <FlatList
        data={correctionData}
        keyExtractor={(item) => item.conversationId.toString()} // provides unique key for each item
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
        ListFooterComponent={
          isLoadingMore ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.backgroundPrimary}
            />
          ) : null
        } // spinner at the bottom
      />
    </View>
  );
}
