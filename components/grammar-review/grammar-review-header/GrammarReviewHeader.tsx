import {
  HeaderContainer,
  HeaderText,
  NoCorrectionsContainer,
  NoCorrectionsText,
  SearchBar,
  SearchBarButton,
  SearchBarInput,
  SearchContainer,
} from './styledGrammarReviewHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useToastModal } from '@/utils/contexts/ToastModalContext';

export default function GrammarReviewHeader({
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
    correctionData,
    searchCorrections,
    pagination,
  } = useCorrectionsData();
  const theme: any = useTheme();
  const { showToast } = useToastModal();
  const { t } = useTranslation();

  const handleSearchSubmit = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    try {
      await searchCorrections({ query, page: 1, limit: pagination.limit });
    } catch (error) {
      showToast(
        'error',
        t('error'),
        t('searchCorrectionsError')
      );
    }
  };

  return (
    <>
      <HeaderContainer hasScrolled={hasScrolled}>
        <HeaderText>{t('grammarReview')}</HeaderText>
        <SearchContainer>
          <SearchBar>
            <SearchBarInput
              placeholder={t('searchCorrections')}
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
      {correctionData.length === 0 && (
        <NoCorrectionsContainer>
          <NoCorrectionsText>
            {isSearching ? t('noResultsFound') : t('startRecording')}
          </NoCorrectionsText>
        </NoCorrectionsContainer>
      )}
    </>
  );
}
