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

  const handleRefresh = async () => {
    setRefreshing(true);
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
    setSearchText(text);
    console.log('Search text:', text);
  };

  return (
    <ErrorReviewContainer>
      <ErrorReviewHeader
        hasScrolled={hasScrolled}
        searchText={searchText}
        handleSearch={handleSearch}
        correctionsFetchError={correctionsFetchError}
        correctionData={correctionData}
      />
      <CorrectionList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        handleScroll={handleScroll}
      />
    </ErrorReviewContainer>
  );
}
