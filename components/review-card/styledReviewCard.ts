import styled from 'styled-components/native';
import colors from '../../assets/globalStyles';

export const CardContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 90%;
  border-radius: 12px;
  border: 1px solid ${colors.cardBorder};
  background-color: ${colors.cardBackground};
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  align-self: center;
  margin: 15px 0;
`;

export const CardHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color:${colors.cardHeaderBackground};
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
  width: 85%;
`;

const CardHeaderText = styled.Text`
  color: ${colors.textWhite};
  font-weight: bold;
`;

export const CardHeaderTextTitle = styled(CardHeaderText)`
  font-size: 16px;
`;
export const CardHeaderTextTime = styled(CardHeaderText)`
  font-size: 13px;
  color: ${colors.cardTimeText};
`;

export const CardContent = styled.View`
  padding: 0 20px 20px 20px;
`;

export const SnippetCard = styled.View`
  background: ${colors.snippetBackground};
  padding: 16px;
  border-radius: 8px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  margin: 15px 0 0 0;
`;

export const OriginalText = styled.Text`
  font-size: 14px;
  color: ${colors.snippetOriginalText};
  font-style: italic;
  margin-bottom: 5px;
`;

export const CorrectedText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.snippetCorrectedText};
  margin-bottom: 5px;
`;

export const ErrorList = styled.View`
  margin-top: 8px;
  padding: 0 0 0 10px;
`;

export const ErrorItem = styled.View`
  border: 1px solid ${colors.snippetErrorText};
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 6px;
`;

export const ErrorHeader = styled.View`
  display: flex;
  flex-direction: row;
`;

export const ErrorArrowIcon = styled(ArrowIcon)`
  margin-right: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ErrorHeaderText = styled.Text`
  width: 90%;
  font-size: 14px;
  color: ${colors.snippetErrorText};
  flex-wrap: wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
`;

export const BoldText = styled.Text`
  font-weight: bold;
`;

export const ItalicText = styled.Text`
  font-style: italic;
`;

export const ErrorTextContainer = styled.View`
  margin-top: 5px;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: ${colors.snippetErrorText};
  margin-bottom: 5px;
`;
