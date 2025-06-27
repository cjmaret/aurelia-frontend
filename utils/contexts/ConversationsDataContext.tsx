import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  ConversationDataContextType,
  ConversationDataType,
  PaginatedConversationsResponseType,
  PaginationType,
  SearchConversationsType,
} from '@/types/types';
import { useAuth } from '@/utils/contexts/AuthContext';
import { showApiErrorToast } from '../functions/showApiErrorToast';
import { useToastModal } from './ToastModalContext';
import { useTranslation } from 'react-i18next';

const ConversationDataContext =
  createContext<ConversationDataContextType | null>(null);

export const ConversationDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, refreshToken, logout, user } = useAuth();
  const { showToast } = useToastModal();
  const { t } = useTranslation();
  const [conversationData, setConversationData] = useState<
    ConversationDataType[]
  >([]);
  const [isProcessingRecording, setIsProcessingRecording] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
  });
  const ANON_CONVERSATION_LIMIT = 15;
  const isAnonymous = user?.isAnonymous;
  const hasReachedAnonLimit =
    (isAnonymous && pagination.total >= ANON_CONVERSATION_LIMIT) || false;

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations({ page: pagination.page, limit: pagination.limit });
    } else {
      setConversationData([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
      });
    }
  }, [isAuthenticated]);

  const fetchConversations = async ({
    page = 1,
    limit = 10,
  }: {
    page: number;
    limit: number;
  }) => {
    try {
      const response: any = await api.getConversations({
        page,
        limit,
      });

      if (!response.success) {
        throw new Error(response.error || 'Unknown error');
      }

      // data can be one of two types so we have to assert this one
      const data = response.data as PaginatedConversationsResponseType;

      if (data && data.conversations.length > 0) {
        setConversationData((prev) =>
          page === 1 ? data.conversations : [...prev, ...data.conversations]
        );

        // update pagination metadata
        setPagination({
          total: data.total,
          page: data.page,
          limit: data.limit,
        });
      } else if (page === 1) {
        setConversationData([]);
      }
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      if (err.status === 401) {
        await attemptRefreshAndRefetch();
        return;
      }
      throw err;
    }
  };

  const searchConversations = async ({
    query,
    page = 1,
    limit = 10,
  }: SearchConversationsType) => {
    try {
      const response = await api.searchConversations({
        query,
        page,
        limit,
      });

      if (response.success) {
        const data = response.data as PaginatedConversationsResponseType;

        if (data && data.conversations.length > 0) {
          setConversationData((prev) =>
            page === 1 ? data.conversations : [...prev, ...data.conversations]
          );

          setPagination({
            total: data.total,
            page: data.page,
            limit: data.limit,
          });
        } else if (page === 1) {
          // Clear conversations if no results are found on the first page
          setConversationData([]);
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
      await fetchConversations({
        page: pagination.page,
        limit: pagination.limit,
      });
    } catch (err) {
      console.error('Token refresh failed. Logging out...');
      showApiErrorToast({ error: err, showToast, t });
      await logout();
    }
  }

  const deleteConversation = async ({
    conversationId,
  }: {
    conversationId: string;
  }): Promise<void> => {
    try {
      const response = await api.deleteConversation({ conversationId });

      if (!response.success) {
        throw new Error('Failed to delete conversation');
      }

      // remove deleted card
      setConversationData((prevData) =>
        prevData.filter((item) => item.conversationId !== conversationId)
      );
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    } catch (err: any) {
      console.error('Error deleting conversation:', err);
      throw err;
    }
  };

  const deleteCorrectionFromConversation = async ({
    conversationId,
    correctionId,
  }: {
    conversationId: string;
    correctionId: string;
  }): Promise<void> => {
    try {
      const response = await api.deleteCorrectionFromConversation({
        conversationId,
        correctionId,
      });

      if (!response.success) {
        throw new Error('Failed to delete correction');
      }

      // update the conversation data to remove the deleted correction
      setConversationData((prevData) =>
        prevData.map((item) =>
          item.conversationId === conversationId
            ? {
                ...item,
                sentenceFeedback: item.sentenceFeedback.filter(
                  (correction) => correction.id !== correctionId
                ),
              }
            : item
        )
      );
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
    <ConversationDataContext.Provider
      value={{
        conversationData,
        setConversationData,
        fetchConversations,
        searchConversations,
        deleteConversation,
        deleteCorrectionFromConversation,
        pagination,
        setPagination,
        resetPagination,
        isProcessingRecording,
        setIsProcessingRecording,
        hasReachedAnonLimit,
      }}>
      {children}
    </ConversationDataContext.Provider>
  );
};

export const useConversationData = (): ConversationDataContextType => {
  const context = useContext(ConversationDataContext);
  if (!context) {
    throw new Error(
      'useConversationData must be used within a ConversationDataProvider'
    );
  }
  return context;
};
