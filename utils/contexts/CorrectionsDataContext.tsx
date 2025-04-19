import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  CorrectionDataContextType,
  CorrectionDataType,
  CorrectionResponseType,
} from '@/types/types';
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
      const response: CorrectionResponseType = await api.getCorrections();

      if (!response.success) {
        console.error('Error fetching corrections:', response.error);
        setCorrectionsFetchError(new Error(response.error || 'Unknown error'));
        return;
      }

      const { data } = response;

      if (!data || data.length === 0) {
        console.warn('No correction data available');
        setCorrectionData([]);
        setCorrectionsFetchError(response.error ? new Error(response.error) : null)
        return;
      }
      const sortedData = sortCorrectionDataChronologically(data);
      setCorrectionData(sortedData);
      setCorrectionsFetchError(null);
    } catch (err: any) {
      console.error('Error fetching corrections:', err);
      setCorrectionsFetchError(err);
      if (err.message === 'Unauthorized') {
        try {
          console.warn('Unauthorized error. Attempting to refresh token...');
          await refreshToken();
          await fetchCorrections();
        } catch (refreshError) {
          console.error('Token refresh failed. Logging out...');
          await logout();
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
