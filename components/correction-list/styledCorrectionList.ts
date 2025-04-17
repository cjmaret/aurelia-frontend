import colors from '@/assets/globalStyles';
import styled from 'styled-components/native';

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
  margin: 25px 0;
`;

export const DateSeparatorLine = styled.View`
  border: 0.5px solid ${colors.dateSeparatorText};
  height: 1px;
  width: 60%;
`;

export const DateSeparatorText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${colors.dateSeparatorText};
  margin-left: 15px;
`;
