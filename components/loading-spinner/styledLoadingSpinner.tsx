import styled from "styled-components/native";

export const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ theme }: { theme: any }) => theme.colors.spinnerOverlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;