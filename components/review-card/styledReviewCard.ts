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
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
  align-self: center;
  margin: 20px 0;
`;

export const CardHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.cardBackground};
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.cardBorder};
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  padding: 20px 0;
  border-radius: 8px;
`;

const ArrowIcon = styled.View``;

export const HeaderArrowIcon = styled(ArrowIcon)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CardHeaderTextContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 91%;
`;

const CardHeaderText = styled.Text.attrs({
  maxFontSizeMultiplier: 2,
})`
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  font-weight: bold;
`;

export const CardHeaderTextTitle = styled(CardHeaderText)`
  flex: 1;
  font-size: 17px;
`;

export const CardHeaderTextTime = styled(CardHeaderText)`
  font-size: 13px;
  color: ${({ theme }: { theme: any }) => theme.colors.cardTimeText};
  margin-right: 5px;
`;

export const CardContent = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CorrectionCountText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  margin-top: 15px;
  margin-left: 15px;
  margin-bottom: 5px;
  width: 93%;
`;

export const SnippetCard = styled.View`
  width: 93%;
  background: ${({ theme }: { theme: any }) => theme.colors.cardBackgroundGray};
  margin: 10px 0 15px 0;
  padding: 20px 12px 5px;
  border-radius: 8px;
`;

// snippet styles

const SnippetItem = styled.View`
  border-radius: 5px;
  padding: 7px 10px;
  margin-bottom: 18px;
`;

export const SnippetContentHeader = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 7px;
`;

export const SnippetContainerLeft = styled.View`
  flex: 1;
`;

export const SnippetContainerRight = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SnippetContentHeaderLabelContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 0 5px 0;
`;

export const IconContainer = styled.View`
  margin-right: 5px;
`;

export const SnippetContentHeaderLabelText = styled.Text.attrs({
  maxFontSizeMultiplier: 2,
})`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const SnippetContentHeaderValueText = styled.Text.attrs({
  maxFontSizeMultiplier: 2,
})`
  font-size: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  font-weight: 500;
`;

export const OriginalItem = styled(SnippetItem)`
  padding: 0 5px 0 10px;
`;

export const OriginalLabelText = styled(SnippetContentHeaderLabelText)``;

export const OriginalValueText = styled(SnippetContentHeaderValueText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextOriginal};
  font-style: italic;
  margin-bottom: 0;
`;

export const CorrectedItem = styled(SnippetItem)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.snippetBackgroundCorrected};
`;

export const CorrectedHeaderLabelText = styled(SnippetContentHeaderLabelText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextCorrected};
`;

export const CorrectedHeaderValueText = styled(SnippetContentHeaderValueText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextCorrected};
  font-weight: 700;
  font-size: 16px;
`;

export const HighlightedCorrectedText = styled.Text`
  font-weight: 900;
  color: ${({ theme }: { theme: any }) =>
    theme.colors.snippetTextCorrectedDark};
  flex-wrap: wrap;
`;

export const ErrorList = styled.View``;

export const ErrorItem = styled(SnippetItem)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.snippetBackgroundError};
`;

export const ErrorArrowIcon = styled(ArrowIcon)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ErrorHeaderLabelText = styled(SnippetContentHeaderLabelText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextError};
`;

export const ErrorHeaderValueText = styled(SnippetContentHeaderValueText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextError};
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

export const ErrorDetailHeader = styled.Text.attrs({
  maxFontSizeMultiplier: 2,
})`
  font-size: 15px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextError};
  margin-bottom: 4px;
`;

export const ErrorDetailText = styled.Text.attrs({
  maxFontSizeMultiplier: 2,
})`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextError};
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
  margin-bottom: 10px;
  border-radius: 5px;
  padding: 20px 15px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
`;

export const ContragulatoryText = styled.Text.attrs({
  maxFontSizeMultiplier: 2,
})`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  text-align: center;
  width: 100%;
`;

export const HighlightedSearchText = styled.Text`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.textHighlight};
  font-weight: bold;
`;

export const DeleteButton = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
  border-radius: 20px;
  width: 20px;
  height: 20px;
  border: 1.5px solid
    ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  position: absolute;
  left: -10px;
  top: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
