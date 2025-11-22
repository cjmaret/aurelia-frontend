import styled from 'styled-components/native';

export const RatingModalContainer = styled.View`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.modalBackgroundPrimary || 'white'};
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

export const RatingModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
`;

export const RatingModalDescription = styled.Text`
  text-align: center;
  margin-bottom: 20px;
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
`;

export const RatingButtonRow = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const FeedbackModalContainer = styled.View`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.modalBackgroundPrimary || 'white'};
  padding: 20px;
  border-radius: 10px;
  max-height: 80%;
`;

export const FeedbackModalTitle = styled.Text`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
`;

export const FeedbackModalDescription = styled.Text`
  margin-bottom: 15px;
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
`;

export const FeedbackTextInput = styled.TextInput`
  border-width: 1px;
  border-color: ${({ theme }: { theme: any }) => theme.colors.buttonBorder};
  border-radius: 8px;
  padding: 12px;
  height: 100px;
  margin-bottom: 15px;
  color: ${({ theme }: { theme: any }) => theme.colors.textTertiary};
`;

export const FeedbackButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const PrimaryButton = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
  background-color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  border-radius: 8px;
  align-items: center;
`;

export const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  padding: 15px;
  margin-right: 10px;
  border-radius: 8px;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.buttonBackgroundSecondary};
  align-items: center;
`;

export const PrimaryButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonTextPrimary};
  font-weight: bold;
`;

export const SecondaryButtonText = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.colors.buttonTextPrimary};
`;
