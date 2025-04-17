import { ErrorReviewContainer, HeaderContainer, HeaderText } from './styledErrorReview';
import { ScrollView } from 'react-native';
import CorrectionList from '../correction-list/CorrectionList';
import ErrorMessage from '../error/ErrorMessage';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';

export default function ErrorReview() {
  const { correctionData, correctionsFetchError } = useCorrectionsData();

  return (
    <ErrorReviewContainer>
      <HeaderContainer>
        <HeaderText>Error Review</HeaderText>
      </HeaderContainer>
      {correctionsFetchError && (
        <ErrorMessage message={correctionsFetchError.message} />
      )}
      <ScrollView style={{ width: '100%' }}>
        <CorrectionList correctionData={correctionData} />
      </ScrollView>
    </ErrorReviewContainer>
  );
}
