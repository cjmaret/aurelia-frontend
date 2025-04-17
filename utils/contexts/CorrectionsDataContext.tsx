import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { CorrectionDataContextType, CorrectionDataType } from '@/types/types';
import { sortCorrectionDataChronologically } from '@/utils/functions/generalFunctions';
import { useAuth } from '@/utils/contexts/AuthContext';

const CorrectionDataContext = createContext<CorrectionDataContextType>({
  correctionData: [],
  setCorrectionData: () => {},
  correctionsFetchError: null,
});


export const CorrectionsDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, handleUnauthorized } = useAuth();
  const [correctionData, setCorrectionData] = useState<CorrectionDataType[]>(
    []
  );
  const [correctionsFetchError, setCorrectionsFetchError] =
    useState<Error | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .getCorrections()
        .then((correctionsRes: CorrectionDataType[]) => {
          const sortedData = sortCorrectionDataChronologically(correctionsRes);
          setCorrectionData(sortedData);
        })
        .catch((err) => {
          if (err.message === 'Token has expired') {
            handleUnauthorized();
          }
          console.error('Error fetching corrections:', err);
          setCorrectionsFetchError(err);
        });
    }
  }, [isAuthenticated]);

  return (
    <CorrectionDataContext.Provider
      value={{ correctionData, setCorrectionData, correctionsFetchError }}>
      {children}
    </CorrectionDataContext.Provider>
  );
};

export const useCorrectionsData = (): CorrectionDataContextType => {
  const context = useContext(CorrectionDataContext);
  if (!context) {
    throw new Error(
      'useCorrectionsData must be used within an CorrectionsDataProvider'
    );
  }
  return context;
};