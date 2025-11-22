import { ReactNode } from "react";

export type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

// api types
export interface ApiTypes {
  baseUrl: string | undefined;
  headers: any;
}

// context types
export interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: SetStateType<boolean>;
  registerAnonymousUser: () => Promise<void>;
  upgradeAnonymousUser: ({
    userEmail,
    password,
  }: {
    userEmail: string;
    password: string;
  }) => Promise<void>;
  login: (userEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserDetails: () => Promise<UserDataType | null>;
  user: UserDataType | null;
  setUser: React.Dispatch<React.SetStateAction<UserDataType | null>>;
  refreshToken: () => Promise<string>;
  deleteUser: () => Promise<void>;
  showOnboarding: boolean;
  setShowOnboarding: SetStateType<boolean>;
}

export interface ConversationDataContextType {
  conversationData: ConversationDataType[];
  setConversationData: SetStateType<ConversationDataType[]>;
  fetchConversations: (params: {
    page: number;
    limit: number;
  }) => Promise<void>;
  searchConversations: (params: SearchConversationsType) => Promise<void>;
  deleteConversation: (params: { conversationId: string }) => Promise<void>;
  deleteCorrectionFromConversation: (params: {
    conversationId: string;
    correctionId: string;
  }) => Promise<void>;
  pagination: PaginationType;
  setPagination: SetStateType<PaginationType>;
  resetPagination: () => void;
  isProcessingRecording: boolean;
  setIsProcessingRecording: SetStateType<boolean>;
  hasReachedAnonLimit: boolean;
}

export interface ReviewPromptContextType {
  showPrompt: () => void;
  hidePrompt: () => void;
  incrementSuccessfulAction: () => Promise<void>;
}

export interface ReviewPromptProviderProps {
  children: ReactNode;
}

// api data types

// // user data types
export interface UserDataType {
  userId: string;
  username: string;
  userEmail: string;
  emailVerified: boolean;
  appLanguage: string;
  targetLanguage: string;
  setupComplete: boolean;
  isAnonymous: boolean;
  oauthProvider: string;
}

// // conversation data types

export interface ConversationResponseType {
  success: boolean;
  data?: ConversationDataType[] | PaginatedConversationsResponseType; // paginated type for fetches, data type for add new conversations
  error?: string;
  status?: number;
}

export interface PaginatedConversationsResponseType {
  conversations: ConversationDataType[];
  total: number;
  page: number;
  limit: number;
}

export interface ConversationDataType {
  conversationId: string;
  createdAt: string;
  originalText: string;
  sentenceFeedback: SentenceFeedback[];
}

export interface SentenceFeedback {
  id: string;
  original: string;
  corrected: string;
  errors: ErrorDetail[];
}

export interface ErrorDetail {
  id: string;
  error: string;
  reason: string;
  suggestion: string;
  improvedClause: string;
}

// misc types

export interface PaginationType {
  total: number;
  page: number;
  limit: number;
}

export interface SearchConversationsType {
  query: string;
  page: number;
  limit: number;
}

// AuthForm types
export interface AuthFormType {
  isSignUp?: boolean;
}

export interface DeleteConfirmationType {
  id: string;
  apiCall: () => Promise<void>;
  alertTitle: string;
  alertMessage: string;
}
