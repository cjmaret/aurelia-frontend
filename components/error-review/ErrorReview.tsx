import {
  ErrorReviewContainer,
  HeaderContainer,
  HeaderText,
} from './styledErrorReview';
import { ScrollView, RefreshControl } from 'react-native';
import CorrectionList from '../correction-list/CorrectionList';
import ErrorMessage from '../error/ErrorMessage';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useState } from 'react';

export default function ErrorReview() {
  const { correctionData, correctionsFetchError, fetchCorrections } =
    useCorrectionsData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCorrections();
    } catch (error) {
      console.error('Error refreshing corrections:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ErrorReviewContainer>
      <HeaderContainer>
        <HeaderText>Error Review</HeaderText>
      </HeaderContainer>
      {correctionsFetchError && (
        <ErrorMessage message={correctionsFetchError.message} />
      )}
      <ScrollView
        style={{ width: '100%' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <CorrectionList correctionData={correctionData} />
      </ScrollView>
    </ErrorReviewContainer>
  );
}
