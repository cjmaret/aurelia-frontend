import React, { createContext, useContext } from 'react';
import Toast from 'react-native-toast-message';
import { ThemedToast, ThemedToastProps } from '../configs/toastConfig';
import { useTheme } from 'styled-components/native';

type ToastModalContextType = {
  showToast: (
    type: 'info' | 'success' | 'error',
    text1: string,
    text2?: string
  ) => void;
};

const ToastModalContext = createContext<ToastModalContextType | undefined>(
  undefined
);

export const ToastModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();

  const toastConfig = {
    info: ({ text1, text2 }: { text1?: string; text2?: string }) => (
      <ThemedToast type="info" text1={text1} text2={text2} theme={theme} />
    ),
    success: ({ text1, text2 }: { text1?: string; text2?: string }) => (
      <ThemedToast type="success" text1={text1} text2={text2} theme={theme} />
    ),
    error: ({ text1, text2 }: { text1?: string; text2?: string }) => (
      <ThemedToast type="error" text1={text1} text2={text2} theme={theme} />
    ),
  };

  const showToast = (
    type: 'info' | 'success' | 'error',
    text1: string,
    text2?: string,
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      visibilityTime: 6000,
    });
  };

  return (
    <ToastModalContext.Provider value={{ showToast }}>
      {children}
      <Toast config={toastConfig} />
    </ToastModalContext.Provider>
  );
};

export const useToastModal = () => {
  const context = useContext(ToastModalContext);
  if (!context) {
    throw new Error('useToastModal must be used within a ToastModalProvider');
  }
  return context;
};
