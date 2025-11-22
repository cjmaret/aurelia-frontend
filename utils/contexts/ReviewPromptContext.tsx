import { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewPrompt from '@/components/review-prompt/ReviewPrompt';
import api from '@/lib/api';
import {
  ReviewPromptContextType,
  ReviewPromptProviderProps,
} from '@/types/types';

// keys for accessing AsyncStorage
const REVIEW_PROMPT_KEYS = {
  LAST_PROMPTED: 'lastReviewPrompt',
  TIMES_PROMPTED: 'timesPrompted',
  USER_RESPONDED: 'userRespondedToReview',
  SUCCESSFUL_ACTIONS: 'successfulActions',
};

const ReviewPromptContext = createContext<ReviewPromptContextType | undefined>(
  undefined
);

export function useReviewPromptContext() {
  const context = useContext(ReviewPromptContext);
  if (!context) {
    throw new Error(
      'useReviewPromptContext must be used within ReviewPromptProvider'
    );
  }
  return context;
}

export function ReviewPromptProvider({ children }: ReviewPromptProviderProps) {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  const checkShouldPrompt = async (): Promise<boolean> => {
    try {
      const lastPrompted = await AsyncStorage.getItem(
        REVIEW_PROMPT_KEYS.LAST_PROMPTED
      );
      const timesPrompted = await AsyncStorage.getItem(
        REVIEW_PROMPT_KEYS.TIMES_PROMPTED
      );
      const userResponded = await AsyncStorage.getItem(
        REVIEW_PROMPT_KEYS.USER_RESPONDED
      );

      if (userResponded === 'true') return false;

      const successfulActions = await AsyncStorage.getItem(
        REVIEW_PROMPT_KEYS.SUCCESSFUL_ACTIONS
      );

      const now = Date.now();
      const lastPromptTime = lastPrompted ? parseInt(lastPrompted) : 0;
      const promptCount = timesPrompted ? parseInt(timesPrompted) : 0;
      const actionCount = successfulActions ? parseInt(successfulActions) : 0;

      const daysSinceLastPrompt =
        (now - lastPromptTime) / (1000 * 60 * 60 * 24);

      // conditions for showing prompt: at least 3 successful actions, haven't prompted in the last 7 days, and haven't prompted more than 3x total
      return actionCount >= 3 && daysSinceLastPrompt >= 7 && promptCount < 3;
    } catch (error) {
      console.error('Error checking review prompt conditions:', error);
      return false;
    }
  };

  const incrementSuccessfulAction = async () => {
    try {
      const current = await AsyncStorage.getItem(
        REVIEW_PROMPT_KEYS.SUCCESSFUL_ACTIONS
      );
      const count = current ? parseInt(current) : 0;
      await AsyncStorage.setItem(
        REVIEW_PROMPT_KEYS.SUCCESSFUL_ACTIONS,
        (count + 1).toString()
      );

      const shouldPrompt = await checkShouldPrompt();
      if (shouldPrompt) {
        setTimeout(() => {
          setShouldShowPrompt(true);
        }, 6000);
      }
    } catch (error) {
      console.error('Error incrementing successful actions:', error);
    }
  };

  const markPromptShown = async () => {
    try {
      const timesPrompted = await AsyncStorage.getItem(
        REVIEW_PROMPT_KEYS.TIMES_PROMPTED
      );
      const count = timesPrompted ? parseInt(timesPrompted) : 0;

      await AsyncStorage.setItem(
        REVIEW_PROMPT_KEYS.LAST_PROMPTED,
        Date.now().toString()
      );
      await AsyncStorage.setItem(
        REVIEW_PROMPT_KEYS.TIMES_PROMPTED,
        (count + 1).toString()
      );
    } catch (error) {
      console.error('Error marking prompt shown:', error);
    }
  };

  const markUserResponded = async () => {
    try {
      await AsyncStorage.setItem(REVIEW_PROMPT_KEYS.USER_RESPONDED, 'true');
    } catch (error) {
      console.error('Error marking user responded:', error);
    }
  };

  const showPrompt = () => {
    setShouldShowPrompt(true);
  };

  const hidePrompt = () => {
    setShouldShowPrompt(false);
  };

  const handleReviewPromptClose = () => {
    setShouldShowPrompt(false);
    markPromptShown();
    markUserResponded();
  };

  const handleFeedbackSubmit = async (feedback: string) => {
    try {
      await api.addUserFeedback(feedback);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <ReviewPromptContext.Provider
      value={{
        showPrompt,
        hidePrompt,
        incrementSuccessfulAction,
      }}>
      {children}
      <ReviewPrompt
        isVisible={shouldShowPrompt}
        onClose={handleReviewPromptClose}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </ReviewPromptContext.Provider>
  );
}
