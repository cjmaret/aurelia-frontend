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
import { ConversationDataType, DeleteConfirmationType } from '@/types/types';
import {
  DateSeparatorContainer,
  DateSeparatorLine,
  DateSeparatorText,
  ReviewCardContainer,
} from './styledConversationList';
import {
  formatDate,
  formatToLocalDate,
} from '@/utils/functions/generalFunctions';
import { useConversationData } from '@/utils/contexts/ConversationsDataContext';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import type { RefreshControlProps } from 'react-native';
import SkeletonReviewCard from '../review-card-skeleton.tsx/SkeletonReviewCard';

export default function ConversationList({
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
  useConversationData();
  const theme: any = useTheme();
  const { showToast } = useToastModal();
  const { t } = useTranslation();
  const {
    conversationData,
    deleteConversation,
    deleteCorrectionFromConversation,
    isProcessingRecording,
  } = useConversationData();
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const handleDelete = async ({
    id,
    apiCall,
    alertTitle,
    alertMessage,
  }: DeleteConfirmationType) => {
    Alert.alert(
      alertTitle,
      alertMessage,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            setDeletingCardId(id);
            try {
              await apiCall();
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

  const handleDeleteCard = ({ conversationId }: { conversationId: string }) =>
    handleDelete({
      id: conversationId,
      apiCall: () => deleteConversation({ conversationId }),
      alertTitle: t('confirmDeleteConversationTitle'),
      alertMessage: t('confirmDeleteConversationMessage'),
    });

  const handleDeleteCorrection = ({
    conversationId,
    correctionId,
  }: {
    conversationId: string;
    correctionId: string;
  }) =>
    handleDelete({
      id: conversationId,
      apiCall: () =>
        deleteCorrectionFromConversation({ conversationId, correctionId }),
      alertTitle: t('confirmDeleteCorrectionTitle'),
      alertMessage: t('confirmDeleteCorrectionMessage'),
    });

  const renderCard = ({
    item: cardData,
    index,
    collapseCardsAndErrors,
    setCollapseCardsAndErrors,
  }: {
    item: ConversationDataType;
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
            dateTimeString: conversationData[index - 1].createdAt,
          })
        : null;

    const showDateSeparator =
      !previousDateLocal || !isSameDay(currentDateLocal, previousDateLocal);

    return (
      <ReviewCardContainer>
        {showDateSeparator && (
          <DateSeparatorContainer>
            <DateSeparatorLine />
            <DateSeparatorText maxFontSizeMultiplier={2} numberOfLines={2}>
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
          handleDeleteCard={(conversationId) =>
            handleDeleteCard({ conversationId })
          }
          handleDeleteCorrection={(conversationId, correctionId) =>
            handleDeleteCorrection({ conversationId, correctionId })
          }
          isDeleting={deletingCardId === cardData.conversationId}
        />
      </ReviewCardContainer>
    );
  };

  return (
    // dont cut off final cards if height changes dynamically
    <View style={{ flex: 1 }}>
      <FlatList
        data={conversationData}
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
        extraData={conversationData}
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
