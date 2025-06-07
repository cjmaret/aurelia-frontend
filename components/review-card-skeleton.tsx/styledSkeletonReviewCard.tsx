import styled from 'styled-components/native';

export const SkeletonContainer = styled.View`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.cardBackground || '#fff'};
  border-radius: 12px;
  margin: 8px 16px;
  padding: 18px 16px;
  min-height: 110px;
  justify-content: center;
  overflow: hidden;
  min-width: 80%;
`;

export const SkeletonBar = styled.View<{ width?: string; height?: number }>`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.skeleton || '#e0e0e0'};
  border-radius: 6px;
  margin-bottom: 10px;
  width: ${({ width }: { width: any }) => width || '80%'};
  height: ${({ height }: { height: any }) => height || 18}px;
  overflow: hidden;
`;
