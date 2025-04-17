import React from 'react';
import { ErrorMessageContainer, ErrorMessageText } from './styledErrorMessage';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <ErrorMessageContainer>
      <ErrorMessageText>Error: {message}</ErrorMessageText>
    </ErrorMessageContainer>
  );
}
