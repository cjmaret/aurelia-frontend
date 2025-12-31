import styled from 'styled-components/native';
import {
  SnippetContentHeaderValueText,
  SnippetContentHeaderLabelText,
  ArrowIcon,
  SnippetItem,
} from '../review-card/styledReviewCard';

export const SnippetContentHeader = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 7px;
`;

export const SnippetContainerLeft = styled.View`
  flex: 1;
`;

export const SnippetContainerRight = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CorrectedHeaderValueText = styled(SnippetContentHeaderValueText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextCorrected};
  font-weight: 700;
  font-size: 16px;
`;

export const CorrectedItem = styled(SnippetItem)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.snippetBackgroundCorrected};
`;

export const ErrorHeaderLabelText = styled(SnippetContentHeaderLabelText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextError};
`;

export const ErrorHeaderValueText = styled(SnippetContentHeaderValueText)`
  color: ${({ theme }: { theme: any }) => theme.colors.snippetTextError};
`;

export const ErrorArrowIcon = styled(ArrowIcon)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
