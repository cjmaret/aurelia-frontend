import { GrammarReviewContainer } from './styledGrammarReview'
import {
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import CorrectionList from '../correction-list/CorrectionList';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useState } from 'react';
import GrammarReviewHeader from './grammar-review-header/GrammarReviewHeader';

export default function GrammarReview() {
  const { fetchCorrections, searchCorrections, pagination } =
    useCorrectionsData();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [collapseCardsAndErrors, setCollapseCardsAndErrors] =
    useState<boolean>(false);

  const resetStatesToNormalFetchState = async () => {
    setIsSearching(false);
    setSearchQuery('');
    setSearchText('');
    setCollapseCardsAndErrors(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setHasScrolled(scrollY > 0);
  };

  const handleSearch = (text: string) => {
    setIsSearching(true);
    setSearchText(text);
  };

  const resetToNormalFetch = async () => {
    resetStatesToNormalFetchState();

    try {
      await fetchCorrections({ page: 1, limit: pagination.limit });
    } catch (error) {
      console.error('Error resetting to normal fetch:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    resetStatesToNormalFetchState();
    try {
      await fetchCorrections({
        page: 1,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error('Error refreshing corrections:', error);
    } finally {
      setRefreshing(false);
    }
  };

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

  return (
    <GrammarReviewContainer>
      <GrammarReviewHeader
        hasScrolled={hasScrolled}
        searchText={searchText}
        handleSearch={handleSearch}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        setSearchQuery={setSearchQuery}
        resetToNormalFetch={resetToNormalFetch}
      />
      <CorrectionList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        searchQuery={searchQuery}
        handleScroll={handleScroll}
        handleLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
        collapseCardsAndErrors={collapseCardsAndErrors}
        setCollapseCardsAndErrors={setCollapseCardsAndErrors}
      />
    </GrammarReviewContainer>
  );
}
