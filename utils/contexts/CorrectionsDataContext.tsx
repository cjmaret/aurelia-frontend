import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '@/lib/api';
import {
  CorrectionDataContextType,
  CorrectionDataType,
  PaginatedCorrectionsResponseType,
  PaginationType,
  SearchCorrectionsType,
} from '@/types/types';
import { useAuth } from '@/utils/contexts/AuthContext';
import { showApiErrorToast } from '../functions/showApiErrorToast';
import { useToastModal } from './ToastModalContext';
import { useTranslation } from 'react-i18next';

const CorrectionDataContext = createContext<CorrectionDataContextType | null>(
  null
);

export const CorrectionsDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, refreshToken, logout, user } = useAuth();
  const { showToast } = useToastModal();
  const { t } = useTranslation();
  const [correctionData, setCorrectionData] = useState<CorrectionDataType[]>(
    []
  );
  const [isProcessingRecording, setIsProcessingRecording] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
  });
  const ANON_CORRECTION_LIMIT = 15;
  const isAnonymous = user?.isAnonymous;
  const hasReachedAnonLimit =
    (isAnonymous && pagination.total >= ANON_CORRECTION_LIMIT) || false;

  useEffect(() => {
    if (isAuthenticated) {
      fetchCorrections({ page: pagination.page, limit: pagination.limit });
    } else {
      setCorrectionData([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
      });
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
      const response: any = await api.getCorrections({
        page,
        limit,
      });

      if (!response.success) {
        throw new Error(response.error || 'Unknown error');
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
    } catch (err: any) {
      console.error('Error fetching corrections:', err);
      if (err.status === 401) {
        await attemptRefreshAndRefetch();
        return;
      }
      throw err;
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
      } else {
        throw new Error(response.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error during search:', err);
      throw err;
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
    } catch (err) {
      console.error('Token refresh failed. Logging out...');
      showApiErrorToast({ error: err, showToast, t });
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
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (err: any) {
      console.error('Error deleting correction:', err);
      throw err;
    }
  };

  const resetPagination = () => {
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
    });
  };

  return (
    <CorrectionDataContext.Provider
      value={{
        correctionData,
        setCorrectionData,
        fetchCorrections,
        searchCorrections,
        deleteCorrection,
        pagination,
        setPagination,
        resetPagination,
        isProcessingRecording,
        setIsProcessingRecording,
        hasReachedAnonLimit,
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
