import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  CorrectionDataContextType,
  CorrectionDataType,
  CorrectionResponseType,
  PaginatedCorrectionsResponseType,
  PaginationType,
  SearchCorrectionsType,
} from '@/types/types';
import { useAuth } from '@/utils/contexts/AuthContext';
import { produceApiErrorAlert } from '../functions/handleApiError';
import { useToastModal } from './ToastModalContext';
import { useTranslation } from 'react-i18next';

const CorrectionDataContext = createContext<CorrectionDataContextType | null>(
  null
);

export const CorrectionsDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { showToast } = useToastModal();
  const { t } = useTranslation();
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchCorrections({ page: pagination.page, limit: pagination.limit });
    }
  }, [isAuthenticated]);

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
      produceApiErrorAlert({
        status: err.status || 0,
        message: err.message || 'Unknown error',
        showToast,
        t,
      });
    }
  };

  const searchCorrections = async ({
    query,
    page = 1,
    limit = 10,
  }: SearchCorrectionsType) => {
    try {
      const response = await api.searchCorrections({
        query,
        page,
        limit,
      });

      if (response.success) {
        const data = response.data as PaginatedCorrectionsResponseType;

        if (data && data.corrections.length > 0) {
          setCorrectionData((prev) =>
            page === 1 ? data.corrections : [...prev, ...data.corrections]
          );

          setPagination({
            total: data.total,
            page: data.page,
            limit: data.limit,
          });
        } else if (page === 1) {
          // Clear corrections if no results are found on the first page
          setCorrectionData([]);
          setPagination({
            total: 0,
            page: 1,
            limit: 10,
          });
        }
        setCorrectionsFetchError(null); // Clear any previous errors
      } else {
        console.error('Search failed:', response.error);
        setCorrectionsFetchError(new Error(response.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Error during search:', err);
      setCorrectionsFetchError(err);
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

  const deleteCorrection = async (conversationId: string): Promise<void> => {
    try {
      const response = await api.deleteConversation({ conversationId });

      if (!response.success) {
        throw new Error('Failed to delete correction');
      }

      // remove deleted card
      setCorrectionData((prevData) =>
        prevData.filter((item) => item.conversationId !== conversationId)
      );
    } catch (err: any) {
      console.error('Error deleting correction:', err);
      produceApiErrorAlert({
        status: err.status || 0,
        message: err.message || 'Unknown error',
        showToast,
        t,
      });
      throw err;
    }
  };

  return (
    <CorrectionDataContext.Provider
      value={{
        correctionData,
        setCorrectionData,
        correctionsFetchError,
        fetchCorrections,
        searchCorrections,
        deleteCorrection,
        pagination,
        setPagination,
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
