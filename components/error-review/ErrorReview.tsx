import {
  ErrorReviewContainer,
  HeaderContainer,
  HeaderText,
  NoCorrectionsContainer,
  NoCorrectionsText,
  SearchBar,
  SearchContainer,
} from './styledErrorReview';
import { RefreshControl, TextInput } from 'react-native';
import CorrectionList from '../correction-list/CorrectionList';
import ErrorMessage from '../error/ErrorMessage';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/assets/globalStyles';

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

  const renderHeader = () => (
    <>
      <HeaderContainer hasScrolled={hasScrolled}>
        <HeaderText>Error Review</HeaderText>
        <SearchContainer>
          <SearchBar>
            <TextInput
              style={{ flex: 1, fontSize: 16, color: colors.textPrimary }}
              placeholder="Search corrections..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={colors.textPrimary}
            />
          </SearchBar>
        </SearchContainer>
      </HeaderContainer>
      {correctionsFetchError && (
        <ErrorMessage message={correctionsFetchError.message} />
      )}
      {correctionData.length === 0 && (
        <NoCorrectionsContainer>
          <NoCorrectionsText>
            Start recording to see your corrections here!
          </NoCorrectionsText>
        </NoCorrectionsContainer>
      )}
    </>
  );

  return (
    <ErrorReviewContainer>
      {renderHeader()}
      <CorrectionList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        handleScroll={handleScroll}
      />
    </ErrorReviewContainer>
  );
}
