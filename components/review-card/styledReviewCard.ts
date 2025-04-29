import styled from 'styled-components/native';

export const CardContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 93%;
  border-radius: 12px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.cardBackground};
  shadow-color: #000000;
  shadow-offset: 0px 5px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  align-self: center;
  margin: 20px 0;
`;

export const CardHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.cardBackground};
  border: 1px solid
    ${({ theme }: { theme: any }) => theme.colors.cardHeaderBorder};
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  padding: 20px;
  border-radius: 8px;
`;

const ArrowIcon = styled.View``;

export const HeaderArrowIcon = styled(ArrowIcon)`
  display: flex;
  align-items: center;
`;

export const CardHeaderTextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CardHeaderText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.cardHeaderText};
  font-weight: bold;
`;

export const CardHeaderTextTitle = styled(CardHeaderText)`
  font-size: 16px;
`;
export const CardHeaderTextTime = styled(CardHeaderText)`
  font-size: 13px;
  color: ${({ theme }: { theme: any }) => theme.colors.cardTimeText};
`;

export const CardContent = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SnippetCard = styled.View`
  width: 93%;
  background: ${({ theme }: { theme: any }) => theme.colors.snippetBackground};
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.cardBorder};
  padding: 20px 16px;
  border-radius: 8px;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  margin: 15px 0;
`;

export const OriginalText = styled.Text`
  font-size: 15px;
  color: ${({ theme }: { theme: any }) => theme.colors.snippetOriginalText};
  font-style: italic;
  margin-bottom: 10px;
`;

export const CorrectedText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.snippetCorrectedText};
  margin-bottom: 10px;
`;

export const HighlightedCorrectedText = styled.Text`
  font-weight: 900;
`;

export const ErrorList = styled.View`
  margin-top: 8px;
`;

export const ErrorItem = styled.View`
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.snippetErrorBackground};
`;

export const ErrorHeader = styled.View`
  display: flex;
  flex-direction: row;
  padding: 5px 0;
`;

export const ErrorArrowIcon = styled(ArrowIcon)`
  margin-right: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ErrorHeaderText = styled.Text`
  display: flex;
  flex-direction: column;
  width: 90%;
  font-size: 16px;
  color: ${({ theme }: { theme: any }) => theme.colors.snippetErrorText};
  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  margin-left: 5px;
`;

export const BoldText = styled.Text`
  font-weight: bold;
`;

export const ItalicText = styled.Text`
  font-style: italic;
`;

export const ErrorTextContainer = styled.View`
  margin: 5px 0;
`;

export const ErrorDetailContainer = styled.View`
  margin-bottom: 15px;
`;

export const ErrorDetailHeader = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.snippetErrorText};
  margin-bottom: 4px;
`;

export const ErrorDetailText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }: { theme: any }) => theme.colors.snippetErrorText};
  margin-left: 10px;
  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const ErrorWhatsWongText = styled(ErrorDetailText)`
  max-width: 200px;
`;

export const ContragulatoryTextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ContragulatoryText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  text-align: center;
  margin-left: 10px;
`;

export const HighlightedSearchText = styled.Text`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.textHighlight};
  font-weight: bold;
`;
