import styled from 'styled-components/native';
import { Animated } from 'react-native';

export const BubbleContainer = styled(Animated.View)`
  position: absolute;
  left: 24px;
  right: 24px;
  padding: 18px 16px;
  background: ${({ theme }: { theme: any }) => theme.colors.cardBackground};
  border-radius: 16px;
  shadow-opacity: ${({ theme }: { theme: any }) =>
    theme.mode === 'light' ? 0.2 : 0.6};
  shadow-radius: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  elevation: 4;
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
  background: ${({ theme }: { theme: any }) => theme.colors.primary};
  padding: 8px 24px;
  border-radius: 8px;
`;

export const GotItText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;
