import styled from 'styled-components/native';

export const WelcomeContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
  height: 100%;
`;

export const WelcomeSubContainerUpper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 300px;
`;

export const WavesImageContainer = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  resize-mode: stretch;
`;

export const JellyfishImageContainer = styled.Image`
  width: 125px;
  height: 125px;
`;

export const WelcomeSubContainerLower = styled.View`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 0;
  gap: 30px;
`;

export const WelcomeTitle = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  margin-top: 40px;
`;

export const WelcomeTextContainer = styled.View``;

export const WelcomeText = styled.Text`
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  text-align: center;
  padding: 0 10px;
  margin-bottom: 5px;
`;

export const GetStartedButton = styled.TouchableOpacity`
  background-color: ${({ theme }: { theme: any }) => theme.colors.primary};
  padding: 15px 65px;
  border-radius: 15px;
  margin-top: 20px;
`;

export const GetStartedButtonText = styled.Text`
  font-size: 20px;
  color: ${({ theme }: { theme: any }) => theme.colors.textPrimary};
  font-weight: bold;
  text-align: center;
`;
