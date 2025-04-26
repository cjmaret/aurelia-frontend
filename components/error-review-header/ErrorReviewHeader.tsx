import { TextInput } from 'react-native';
import {
  HeaderContainer,
  HeaderText,
  NoCorrectionsContainer,
  NoCorrectionsText,
  SearchBar,
  SearchBarButton,
  SearchBarInput,
  SearchContainer,
} from './styledErrorReviewHeader';
import ErrorMessage from '../error/ErrorMessage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useTheme } from 'styled-components/native';

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
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  setSearchQuery: (query: string) => void;
  resetToNormalFetch: () => void;
}) {
  const {
    correctionsFetchError,
    correctionData,
    searchCorrections,
    pagination,
  } = useCorrectionsData();
  const theme = useTheme();

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
            <SearchBarInput
              placeholder="Search corrections..."
              placeholderTextColor={theme.colors.textSecondary}
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
                  color={theme.colors.textSecondary}
                />
              </SearchBarButton>
            ) : (
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={theme.colors.textSecondary}
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
