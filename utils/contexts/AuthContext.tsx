import { AuthContextType, UserDataType } from '@/types/types';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';
import { usePathname, useRouter } from 'expo-router';
import api from '@/lib/api';
import { useTheme } from 'styled-components/native';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme: any = useTheme();
  const [user, setUser] = useState<UserDataType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const PUBLIC_ROUTES = ['/signIn', '/signUp', '/reset-password'];

  useEffect(() => {
    const interval = setInterval(async () => {
      const storedToken = await SecureStore.getItemAsync('accessToken');
      if (storedToken) {
        const decodedToken: { exp: number } = jwtDecode(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          console.warn('Token expired. Attempting to refresh...');
          await handleUnauthorized();
        }
      }
    }, 5 * 60 * 1000); // check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // run token check on mount
  useEffect(() => {
    checkToken();
  }, []);

  // handle navigation after loading is complete
  useEffect(() => {
    if (!loading) {
      handleNavigation();
    }
  }, [loading, isAuthenticated, user]);

  const checkToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('accessToken');
      if (storedToken) {
        const decodedToken: { exp: number } = jwtDecode(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          console.warn('Token has expired');
          await handleUnauthorized();
          return;
        }

        await getUserDetails();
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Error during token check:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace('/signIn');
    } else if (
      user &&
      !user.setupComplete &&
      !PUBLIC_ROUTES.includes(pathname)
    ) {
      router.replace('/(setup)/setupTab');
    }
  };

  const login = async (userEmail: string, password: string) => {
    try {
      const { accessToken, refreshToken } = await api.authenticateUser(
        userEmail,
        password
      );

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);

      const userDetails = await getUserDetails();

      if (userDetails.setupComplete) {
        router.replace('/');
      } else {
        router.replace('/(setup)/setupTab');
      }
    } catch (err) {
      console.error('Error during login in auth context:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/signIn');
    } catch (err) {
      console.error('Error during logout:', err);
      throw err;
    }
  };

  const refreshToken = async () => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!storedRefreshToken) {
        console.warn('No refresh token available. Logging out...');
        await logout();
        throw new Error('No refresh token available');
      }

      const response = await api.refreshToken(storedRefreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response;

      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', newRefreshToken);

      return accessToken;
    } catch (err) {
      console.error('Error refreshing token:', err);
      console.warn('Token refresh failed. Logging out...');
      await logout();
      throw err;
    }
  };

  const handleUnauthorized = async () => {
    try {
      console.warn('Token expired. Attempting to refresh...');
      const newToken = await refreshToken();
      if (newToken) {
        console.log('Token refreshed successfully');
        await getUserDetails();
      }
    } catch (error) {
      console.warn('Token refresh failed. Logging out...');
      await logout();
    }
  };

  const getUserDetails = async () => {
    try {
      const userDetails = await api.getUserDetails();
      setUser(userDetails);
      setIsAuthenticated(true);
      return userDetails;
    } catch (err) {
      console.error('Error fetching user details:', err);
      throw err;
    }
  };

  const deleteUser = async () => {
    try {
      await api.deleteUser();
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/signIn');
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        getUserDetails,
        user,
        setUser,
        refreshToken,
        deleteUser,
        showOnboarding,
        setShowOnboarding,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
