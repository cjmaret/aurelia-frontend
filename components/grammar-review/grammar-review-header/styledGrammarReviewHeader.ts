import { Platform } from 'react-native';
import styled from 'styled-components/native';

const isTablet = Platform.OS === 'ios' && Platform.isPad;

export const HeaderContainer = styled.View<{ hasScrolled: boolean }>`
  width: 100%;
  background-color: dateSeparatorColor;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 1;
  padding: 30px 20px 20px 20px;
  gap: 20px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({ hasScrolled }: { hasScrolled: boolean }) =>
    hasScrolled
      ? ({ theme }: { theme: any }) => theme.colors.cardHeaderBorder
      : 'transparent'};
`;

export const HeaderText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  flex-wrap: wrap;
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
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.cardBackground};
  border-radius: 8px;
  padding: 8px 12px;
  shadow-color: #000000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  width: 100%;
  max-width: ${isTablet ? '500px' : '300px'};
`;

export const SearchBarInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
`;

export const SearchBarButton = styled.TouchableOpacity``;

export const NoCorrectionsContainer = styled.View`
  max-width: 200px;
  border-radius: 10px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.cardBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: 50px;
`;

export const NoCorrectionsText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetOriginalText};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
