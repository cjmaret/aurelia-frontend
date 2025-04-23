import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  CorrectionDataContextType,
  CorrectionDataType,
  CorrectionResponseType,
  PaginatedCorrectionsResponseType,
  PaginationType,
} from '@/types/types';
import { sortCorrectionDataChronologically } from '@/utils/functions/generalFunctions';
import { useAuth } from '@/utils/contexts/AuthContext';
import { produceApiErrorAlert } from '../functions/handleApiError';

const CorrectionDataContext = createContext<CorrectionDataContextType>({
  correctionData: [],
  setCorrectionData: () => {},
  fetchCorrections: async ({ page = 1, limit = 10 }: { page: number; limit: number }) => {},
  correctionsFetchError: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
});

export const CorrectionsDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, refreshToken, logout } = useAuth();
  const [correctionData, setCorrectionData] = useState<CorrectionDataType[]>(
    []
  );
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
  });
  const [correctionsFetchError, setCorrectionsFetchError] =
    useState<Error | null>(null);

  const fetchCorrections = async ({
    page = 1,
    limit = 10,
  }: {
    page: number;
    limit: number;
  }) => {
    try {
      const response: CorrectionResponseType = await api.getCorrections({
        page,
        limit,
      });

      if (!response.success) {
        console.error('Error fetching corrections:', response.error);
        setCorrectionsFetchError(new Error(response.error || 'Unknown error'));
        return;
      }

      // data can be one of two types so we have to assert this one
      const data = response.data as PaginatedCorrectionsResponseType;

      if (data && data.corrections.length > 0) {
        setCorrectionData((prev) =>
          page === 1 ? data.corrections : [...prev, ...data.corrections]
        );

        // update pagination metadata
        setPagination({
          total: data.total,
          page: data.page,
          limit: data.limit,
        });
      } else if (page === 1) {
        setCorrectionData([]);
      }

      setCorrectionsFetchError(null);
    } catch (err: any) {
      console.error('Error fetching corrections:', err);
      setCorrectionsFetchError(err);
      if (err.status === 401) {
        attemptRefreshAndRefetch();
      }
      produceApiErrorAlert(err.status || 0, err.message || 'Unknown error');
    }
  };

  async function attemptRefreshAndRefetch(): Promise<void> {
    try {
      console.warn('Unauthorized error. Attempting to refresh token...');
      await refreshToken();
      await fetchCorrections({
        page: pagination.page,
        limit: pagination.limit,
      });
    } catch (refreshError) {
      console.error('Token refresh failed. Logging out...');
      await logout();
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCorrections({ page: pagination.page, limit: pagination.limit });
    }
  }, [isAuthenticated]);

  return (
    <CorrectionDataContext.Provider
      value={{
        correctionData,
        setCorrectionData,
        correctionsFetchError,
        fetchCorrections,
        pagination,
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
