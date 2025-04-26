import styled from 'styled-components/native';

export const ErrorReviewContainer = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  display: flex;
  align-items: center;
`;
