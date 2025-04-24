import { ErrorReviewContainer } from './styledErrorReview';
import { RefreshControl } from 'react-native';
import CorrectionList from '../correction-list/CorrectionList';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useState } from 'react';
import ErrorReviewHeader from '../error-review-header/ErrorReviewHeader';

export default function ErrorReview() {
  const {
    correctionData,
    correctionsFetchError,
    fetchCorrections,
    pagination,
  } = useCorrectionsData();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const resetToNormalFetchState = async () => {
    setIsSearching(false);
    setSearchQuery(null);
    setSearchText('');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    resetToNormalFetchState();
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

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setHasScrolled(scrollY > 0);
  };

  const handleSearch = (text: string) => {
    setIsSearching(true);
    setSearchText(text);
    console.log('Search text:', text);
  };

  const resetToNormalFetch = async () => {
    resetToNormalFetchState();

    try {
      await fetchCorrections({ page: 1, limit: pagination.limit });
    } catch (error) {
      console.error('Error resetting to normal fetch:', error);
    }
  };

  return (
    <ErrorReviewContainer>
      <ErrorReviewHeader
        hasScrolled={hasScrolled}
        searchText={searchText}
        handleSearch={handleSearch}
        correctionsFetchError={correctionsFetchError}
        correctionData={correctionData}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        setSearchQuery={setSearchQuery}
        resetToNormalFetch={resetToNormalFetch}
      />
      <CorrectionList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        handleScroll={handleScroll}
        isSearching={isSearching}
        searchQuery={searchQuery}
      />
    </ErrorReviewContainer>
  );
}
