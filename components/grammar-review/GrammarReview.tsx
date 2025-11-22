import {
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { GrammarReviewContainer } from './styledGrammarReview';
import ConversationList from '../conversation-list/ConversationList';
import { useConversationData } from '@/utils/contexts/ConversationsDataContext';
import { useEffect, useState } from 'react';
import GrammarReviewHeader from './grammar-review-header/GrammarReviewHeader';
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import { useTheme } from 'styled-components/native';
import LoginButton from '../login-button/LoginButton';

export default function GrammarReview() {
  const theme: any = useTheme();
  const { showToast } = useToastModal();
  const { t } = useTranslation();
  const {
    fetchConversations,
    searchConversations,
    pagination,
    isProcessingRecording,
  } = useConversationData();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isInSearchMode, setIsInSearchMode] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMoreCards, setIsLoadingMoreCards] = useState<boolean>(false);
  const [collapseCardsAndErrors, setCollapseCardsAndErrors] =
    useState<boolean>(false);

  useEffect(() => {
    if (isProcessingRecording) {
      showToast(
        'info',
        t('processingRecording'),
        t('processingRecordingMessage')
      );
    }
  }, [isProcessingRecording]);

  // reset search state when user leaves GrammarReview tab
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetToNormalFetch();
      };
    }, [])
  );

  const resetStatesToNormalFetchState = async () => {
    setIsInSearchMode(false);
    setSearchQuery('');
    setSearchText('');
    setCollapseCardsAndErrors(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setHasScrolled(scrollY > 0);
  };

  const handleSearch = (text: string) => {
    setIsInSearchMode(true);
    setSearchText(text);
  };

  const resetToNormalFetch = async () => {
    setIsSearchLoading(true);

    try {
      await fetchConversations({ page: 1, limit: pagination.limit });
      resetStatesToNormalFetchState();
    } catch (error: any) {
      showApiErrorToast({
        error,
        showToast,
        t,
      });
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    resetStatesToNormalFetchState();
    try {
      await fetchConversations({
        page: 1,
        limit: pagination.limit,
      });
    } catch (error: any) {
      showApiErrorToast({
        error,
        showToast,
        t,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = async () => {
    if (
      isLoadingMoreCards ||
      pagination.page * pagination.limit >= pagination.total // no more data to fetch
    ) {
      return;
    }

    setIsLoadingMoreCards(true);
    try {
      if (isInSearchMode && searchQuery) {
        await searchConversations({
          query: searchQuery,
          page: pagination.page + 1,
          limit: pagination.limit,
        });
      } else {
        await fetchConversations({
          page: pagination.page + 1,
          limit: pagination.limit,
        });
      }
    } catch (error: any) {
      showApiErrorToast({
        error,
        showToast,
        t,
      });
    } finally {
      setIsLoadingMoreCards(false);
    }
  };

  return (
    <GrammarReviewContainer>
      <LoginButton />
      <GrammarReviewHeader
        hasScrolled={hasScrolled}
        searchText={searchText}
        handleSearch={handleSearch}
        isInSearchMode={isInSearchMode}
        setIsInSearchMode={setIsInSearchMode}
        setIsSearchLoading={setIsSearchLoading}
        setSearchQuery={setSearchQuery}
        resetToNormalFetch={resetToNormalFetch}
      />
      <ConversationList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.textSecondary}
            colors={[theme.colors.textSecondary]}
          />
        }
        searchQuery={searchQuery}
        handleScroll={handleScroll}
        handleLoadMore={handleLoadMore}
        isLoadingMoreCards={isLoadingMoreCards}
        collapseCardsAndErrors={collapseCardsAndErrors}
        setCollapseCardsAndErrors={setCollapseCardsAndErrors}
      />
      {isSearchLoading && <LoadingSpinner />}
    </GrammarReviewContainer>
  );
}
