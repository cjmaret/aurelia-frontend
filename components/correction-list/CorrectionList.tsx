import React from 'react';
import ReviewCard from '../review-card/ReviewCard';
import { isSameDay, parseISO, startOfDay } from 'date-fns';
import { CorrectionDataType } from '@/types/types';
import {
  DateSeparatorContainer,
  DateSeparatorLine,
  DateSeparatorText,
  ReviewCardContainer,
} from './styledCorrectionList';
import {
  formatDate,
  formatToLocalDate,
} from '@/utils/functions/generalFunctions';

export default function CorrectionList({
  correctionData,
}: {
  correctionData: CorrectionDataType[];
}) {
  return (
    <>
      {correctionData?.map((cardData: CorrectionDataType, index: number) => {
        const currentDateLocal = formatToLocalDate({
          dateTimeString: cardData.createdAt,
        });
        const previousDateLocal =
          index > 0
            ? formatToLocalDate({
                dateTimeString: correctionData[index - 1].createdAt,
              })
            : null;

        // show date separator if it's the first item or if the current date is different from the previous convo's date
        const showDateSeparator =
          !previousDateLocal || !isSameDay(currentDateLocal, previousDateLocal);

        return (
          <ReviewCardContainer key={index}>
            {showDateSeparator && (
              <DateSeparatorContainer>
                <DateSeparatorLine />
                <DateSeparatorText>
                  {formatDate({ dateTimeString: cardData.createdAt })}
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
