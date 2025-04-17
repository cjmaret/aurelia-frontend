import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { CorrectionDataContextType, CorrectionDataType } from '@/types/types';
import { sortCorrectionDataChronologically } from '@/utils/functions/generalFunctions';
import { useAuth } from '@/utils/contexts/AuthContext';

const CorrectionDataContext = createContext<CorrectionDataContextType>({
  correctionData: [],
  setCorrectionData: () => {},
  fetchCorrections: async () => {},
  correctionsFetchError: null,
});

export const CorrectionsDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, refreshToken, logout } = useAuth();
  const [correctionData, setCorrectionData] = useState<CorrectionDataType[]>(
    []
  );
  const [correctionsFetchError, setCorrectionsFetchError] =
    useState<Error | null>(null);

  const fetchCorrections = async () => {
    try {
      const correctionsRes = await api.getCorrections(); // API call
      const sortedData = sortCorrectionDataChronologically(correctionsRes); // Sort data
      setCorrectionData(sortedData); // Update state
      setCorrectionsFetchError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Error fetching corrections:', err);
      setCorrectionsFetchError(err); // Set error state
      if (err.message === 'Unauthorized') {
        try {
          console.warn('Unauthorized error. Attempting to refresh token...');
          await refreshToken(); // Attempt to refresh token
          await fetchCorrections(); // Retry fetching corrections after refreshing token
        } catch (refreshError) {
          console.error('Token refresh failed. Logging out...');
          await logout(); // Log out if token refresh fails
        }
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCorrections();
    }
  }, [isAuthenticated]);

  return (
    <CorrectionDataContext.Provider
      value={{
        correctionData,
        setCorrectionData,
        correctionsFetchError,
        fetchCorrections,
      }}>
      {children}
    </CorrectionDataContext.Provider>
  );
};

export const useCorrectionsData = (): CorrectionDataContextType => {
  const context = useContext(CorrectionDataContext);
  if (!context) {
    throw new Error(
      'useCorrectionsData must be used within a CorrectionsDataProvider'
    );
  }
  return context;
};
