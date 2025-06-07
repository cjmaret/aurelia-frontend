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
  isInSearchMode,
  setIsInSearchMode,
  setIsSearchLoading,
  setSearchQuery,
  resetToNormalFetch,
}: {
  hasScrolled: boolean;
  searchText: string;
  handleSearch: (text: string) => void;
  isInSearchMode: boolean;
  setIsInSearchMode: (isInSearchMode: boolean) => void;
  setIsSearchLoading: (isSearchLoading: boolean) => void;
  setSearchQuery: (query: string) => void;
  resetToNormalFetch: () => void;
}) {
  const {
    correctionData,
    searchCorrections,
    pagination,
    isProcessingRecording,
  } = useCorrectionsData();
  const theme: any = useTheme();
  const { showToast } = useToastModal();
  const { t } = useTranslation();

  const handleSearchSubmit = async (query: string) => {
    setIsInSearchMode(true);
    setSearchQuery(query);
    setIsSearchLoading(true);

    try {
      await searchCorrections({ query, page: 1, limit: pagination.limit });
    } catch (error) {
      showToast('error', t('error'), t('searchCorrectionsError'));
    } finally {
      setIsSearchLoading(false);
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
            {isInSearchMode ? (
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
      {correctionData.length === 0 && !isProcessingRecording && (
        <NoCorrectionsContainer>
          <NoCorrectionsText>
            {isInSearchMode ? t('noResultsFound') : t('startRecording')}
          </NoCorrectionsText>
        </NoCorrectionsContainer>
      )}
    </>
  );
}
