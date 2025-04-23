import { TextInput } from 'react-native';
import {
  HeaderContainer,
  HeaderText,
  NoCorrectionsContainer,
  NoCorrectionsText,
  SearchBar,
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
}: {
  hasScrolled: boolean;
  searchText: string;
  handleSearch: (text: string) => void;
  correctionsFetchError: Error | null;
  correctionData: any[];
}) {
  const { correctionsFetchError, correctionData } = useCorrectionsData();

  return (
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
}
