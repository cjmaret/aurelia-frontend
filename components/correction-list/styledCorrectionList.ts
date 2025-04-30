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
  /* move closer to below card to because above card's shadow makes distance look uneven */
  margin: 20px 0 15px 0;
  /* border: 1px solid red; */
`;

export const DateSeparatorLine = styled.View`
  border: 0.5px solid
    ${({ theme }: { theme: any }) => theme.colors.dateSeparatorColor};
  height: 1px;
  width: 60%;
`;

export const DateSeparatorText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }: { theme: any }) => theme.colors.dateSeparatorColor};
  margin-left: 15px;
  /* border: 1px solid red; */
  max-width: 90px;
  text-align: center;
`;
