import { TextInput } from 'react-native';
import {
  HeaderContainer,
  HeaderText,
  NoCorrectionsContainer,
  NoCorrectionsText,
  SearchBar,
  SearchBarButton,
  SearchContainer,
} from './styledErrorReviewHeader';
import ErrorMessage from '../error/ErrorMessage';
import colors from '@/assets/globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';

export default function ErrorReviewHeader({
  hasScrolled,
  searchText,
  handleSearch,
  isSearching,
  setIsSearching,
  setSearchQuery,
  resetToNormalFetch,
}: {
  hasScrolled: boolean;
  searchText: string;
  handleSearch: (text: string) => void;
  correctionsFetchError: Error | null;
  correctionData: any[];
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  setSearchQuery: (query: string | null) => void;
  resetToNormalFetch: () => void;
}) {
  const {
    correctionsFetchError,
    correctionData,
    setCorrectionData,
    searchCorrections,
    pagination,
  } = useCorrectionsData();

  const handleSearchSubmit = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    try {
      await searchCorrections({ query, page: 1, limit: pagination.limit });
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  return (
    <>
      <HeaderContainer hasScrolled={hasScrolled}>
        <HeaderText>Error Review</HeaderText>
        <SearchContainer>
          <SearchBar>
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.textSecondary,
              }}
              placeholder="Search corrections..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={handleSearch}
              onSubmitEditing={() => handleSearchSubmit(searchText)}
              returnKeyType="search"
            />
            {isSearching ? (
              <SearchBarButton onPress={resetToNormalFetch}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.textSecondary}
                />
              </SearchBarButton>
            ) : (
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={colors.textSecondary}
              />
            )}
          </SearchBar>
        </SearchContainer>
      </HeaderContainer>
      {correctionsFetchError && (
        <ErrorMessage message={correctionsFetchError.message} />
      )}
      {correctionData.length === 0 && correctionsFetchError === null && (
        <NoCorrectionsContainer>
          <NoCorrectionsText>
            {isSearching
              ? 'No results found for your search.'
              : 'Start recording to see your corrections here!'}{' '}
          </NoCorrectionsText>
        </NoCorrectionsContainer>
      )}
    </>
  );
}
