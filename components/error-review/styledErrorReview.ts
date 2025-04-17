import styled from 'styled-components/native';
import colors from '../../assets/globalStyles';

export const ErrorReviewContainer = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${colors.background};
  display: flex;
  align-items: center;
  padding: 0 0 90px 0;
`;

export const HeaderContainer = styled.View`
  width: 100%;
  height: 100px;
  background-color: ${colors.primary};
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const HeaderText = styled.Text`
  color: ${colors.textWhite};
  font-size: 20px;
  font-weight: bold;
`;
