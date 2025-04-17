import React from 'react';
import { View, Text } from 'react-native';
import ReviewCard from '../review-card/ReviewCard';
import { format, isSameDay, parseISO } from 'date-fns';
import { CorrectionDataType } from '@/types/types';
import {
  DateSeparatorContainer,
  DateSeparatorLine,
  DateSeparatorText,
  ReviewCardContainer,
} from './styledCorrectionList';

export default function CorrectionList({
  correctionData,
}: {
  correctionData: CorrectionDataType[];
}) {
  return (
    <>
      {correctionData?.map((cardData: CorrectionDataType, index: number) => {
        const currentDate = parseISO(cardData.createdAt);
        const previousDate =
          index > 0 ? parseISO(correctionData[index - 1].createdAt) : null;

        // show date separator if it's the first item or if the current date is different from the previous convo's date
        const showDateSeparator =
          !previousDate || !isSameDay(currentDate, previousDate);

        return (
          <ReviewCardContainer key={index}>
            {showDateSeparator && (
              <DateSeparatorContainer>
                <DateSeparatorLine/>
                <DateSeparatorText>
                  {format(currentDate, 'MMMM d, yyyy')}
                </DateSeparatorText>
              </DateSeparatorContainer>
            )}
            <ReviewCard cardData={cardData} />
          </ReviewCardContainer>
        );
      })}
    </>
  );
}
