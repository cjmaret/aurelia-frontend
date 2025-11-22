import styled from 'styled-components/native';
import { Animated, Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;

export const BubbleContainer = styled(Animated.View)<{ step: number }>`
  width: 90%;
  max-width: 400px;
  padding: 18px 16px;
  background: ${({ theme }: { theme: any }) => theme.colors.cardBackground};
  border-radius: 16px;
  shadow-opacity: ${({ theme }: { theme: any }) =>
    theme.mode === 'light' ? 0.2 : 0.6};
  shadow-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  elevation: 4;
  z-index: 100;
  align-self: ${({ step }: { step: number }) =>
    step === 0 ? 'center' : 'flex-end'};
  margin-bottom: ${({ step }: { step: number }) =>
    step === 0 ? '0' : `${screenHeight * 0.05}px`};
`;

export const BubbleTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 12px;
`;

export const BubbleText = styled.Text`
  font-size: 17px;
  color: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  text-align: center;
`;

export const GotItButton = styled.TouchableOpacity`
  margin-top: 18px;
  align-self: center;
  background: ${({ theme }: { theme: any }) => theme.colors.textSecondary};
  padding: 8px 24px;
  border-radius: 8px;
`;

export const GotItText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;
