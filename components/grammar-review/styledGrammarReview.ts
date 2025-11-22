import styled from 'styled-components/native';

export const GrammarReviewContainer = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
`;
