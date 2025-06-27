import { Platform } from 'react-native';
import styled from 'styled-components/native';

const isTablet = Platform.OS === 'ios' && Platform.isPad;

export const ReviewCardContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const DateSeparatorContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 90%;
  /* move closer to below card to because above card's shadow makes distance look uneven */
  margin: 20px 0 15px 0;
`;

export const DateSeparatorLine = styled.View`
  border: 0.5px solid
    ${({ theme }: { theme: any }) => theme.colors.dateSeparatorColor};
  height: 1px;
  width: ${isTablet ? '80%' : '60%'};
`;

export const DateSeparatorText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.dateSeparatorColor};
  margin-left: 15px;
  max-width: 90px;
  text-align: center;
`;
