import styled from 'styled-components/native';
import colors from '../../assets/globalStyles';

export const ErrorReviewContainer = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${colors.background};
  display: flex;
  align-items: center;
  padding: 0 0 90px 0;
`;

export const HeaderContainer = styled.View<{ hasScrolled: boolean }>`
  width: 100%;
  background-color: ${colors.background};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 1;
  padding: 30px 20px 20px 20px;
  gap: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ hasScrolled }: { hasScrolled: boolean }) =>
    hasScrolled ? colors.cardBorder : 'transparent'};
`;

export const HeaderText = styled.Text`
  color: ${colors.textSecondary};
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const SearchContainer = styled.View`
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
`;

export const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.cardBackground};
  border-radius: 8px;
  padding: 8px 12px;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  width: 100%;
  max-width: 300px;
`;

export const NoCorrectionsContainer = styled.View`
  max-width: 200px;
  border-radius: 10px;
  background-color: ${colors.cardBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: 50px;
`;

export const NoCorrectionsText = styled.Text`
  color: ${colors.snippetOriginalText};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
