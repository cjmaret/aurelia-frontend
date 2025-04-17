export type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

// api types
export interface ApiTypes {
  baseUrl: string | undefined;
  headers: any;
}

// context types
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (userEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handleUnauthorized: () => Promise<void>;
  user: UserDataType | null;
  setUser: React.Dispatch<React.SetStateAction<UserDataType | null>>;
};

export interface CorrectionDataContextType {
  correctionData: CorrectionDataType[];
  setCorrectionData: SetStateType<CorrectionDataType[]>;
  correctionsFetchError: Error | null;
}

// api data types
export interface UserDataType {
  username: string;
  userEmail: string;
  targetLanguage: string;
  appLanguage: string;
  setupComplete: boolean;
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

// AuthForm types
export interface AuthFormTypes {
  isSignUp?: boolean;
}
