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

export interface CorrectionDataContextType {
  correctionData: CorrectionDataType[];
  setCorrectionData: SetStateType<CorrectionDataType[]>;
  fetchCorrections: (params: { page: number; limit: number }) => Promise<void>;
  searchCorrections: (params: SearchCorrectionsType) => Promise<void>;
  deleteCorrection: (conversationId: string) => Promise<void>;
  pagination: PaginationType;
  setPagination: SetStateType<PaginationType>;
  resetPagination: () => void;
  isProcessingRecording: boolean;
  setIsProcessingRecording: SetStateType<boolean>;
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
  oauthProvider: string;
}

// // correction data types

export interface CorrectionResponseType {
  success: boolean;
  data?: CorrectionDataType[] | PaginatedCorrectionsResponseType; // paginated type for fetches, data type for add new corrections
  error?: string;
  status?: number;
}

export interface PaginatedCorrectionsResponseType {
  corrections: CorrectionDataType[];
  total: number;
  page: number;
  limit: number;
}

export interface CorrectionDataType {
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

export interface SearchCorrectionsType {
  query: string;
  page: number;
  limit: number;
}

// AuthForm types
export interface AuthFormTypes {
  isSignUp?: boolean;
}
