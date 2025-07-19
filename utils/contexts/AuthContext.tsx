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
  const getStoredAnonymousUserId = async () =>
    await SecureStore.getItemAsync('anonymousUserId');
  const getStoredAnonymousUserSecret = async () =>
    await SecureStore.getItemAsync('anonymousUserSecret');
  const getStoredAccessToken = async () =>
    await SecureStore.getItemAsync('accessToken');
  const getStoredRefreshToken = async () =>
    await SecureStore.getItemAsync('refreshToken');
  const getStoredUserId = async () => await SecureStore.getItemAsync('userId');
  const deleteStoredTokens = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const storedToken = await getStoredAccessToken();
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

  const handleNavigation = () => {
    // if not authenticated, redirect to signin page
    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace('/signIn');
    }
  };

  const checkToken = async () => {
    try {
      const accessToken = await getStoredAccessToken();
      const userId = await getStoredUserId();
      const anonymousUserId = await getStoredAnonymousUserId();
      const anonymousUserSecret = await getStoredAnonymousUserSecret();

      if (accessToken) {
        // use token as normal
        const decodedToken: { exp: number } = jwtDecode(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          // token expired, try to refresh
          await handleUnauthorized();
          return;
        }
        await getUserDetails();
      } else if (userId) {
        // registered user, logged out: force login
        setIsAuthenticated(false);
        setUser(null);
      } else if (anonymousUserId && anonymousUserSecret) {
        // anonymous user with no tokens: restore session
        await restoreAnonymousUser(anonymousUserId, anonymousUserSecret);
      } else {
        // new user: register anonymous
        await registerAnonymousUser();
      }
    } catch (err) {
      console.error('Error during token check:', err);
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/signIn');
    } finally {
      setLoading(false);
    }
  };

  const registerAnonymousUser = async () => {
    try {
      const response = await api.registerAnonymousUser();
      const { accessToken, refreshToken, userId, userSecret } = response;

      // store tokens and anonymous account details
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('anonymousUserId', userId);
      await SecureStore.setItemAsync('anonymousUserSecret', userSecret);

      const userDetails = await getUserDetails();

      if (userDetails.setupComplete) {
        router.replace('/');
      } else {
        router.replace('/(setup)/welcomeTab');
      }
    } catch (err) {
      console.error('Error during anonymous login:', err);
      setLoading(false);
    }
  };

  const restoreAnonymousUser = async (userId: string, userSecret: string) => {
    try {
      console.log('Restoring anonymous user:', userId);
      const response = await api.restoreAnonymousUser(userId, userSecret);
      const { accessToken, refreshToken } = response;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await getUserDetails();
    } catch (err) {
      console.error('Error restoring anonymous user:', err);
      await registerAnonymousUser();
    }
  };

  const upgradeAnonymousUser = async ({
    userEmail,
    password,
  }: {
    userEmail: string;
    password: string;
  }) => {
    try {
      const storedAnonymousUserId = await getStoredAnonymousUserId();
      const storedAnonymousUserSecret = await getStoredAnonymousUserSecret();

      if (!storedAnonymousUserId || !storedAnonymousUserSecret) {
        throw new Error('No anonymous user session found');
      }

      const response = await api.upgradeAnonymousUser({
        userId: storedAnonymousUserId,
        userSecret: storedAnonymousUserSecret,
        userEmail,
        password,
      });

      const { accessToken, refreshToken, userId } = response;

      // store tokens and user details, delete anonymous session
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('userId', userId);
      await SecureStore.deleteItemAsync('anonymousUserId');
      await SecureStore.deleteItemAsync('anonymousUserSecret');

      const userDetails = await getUserDetails();

      if (userDetails.setupComplete) {
        router.replace('/');
      } else {
        router.replace('/(setup)/setupTab');
      }
    } catch (err) {
      console.error('Error upgrading anonymous user:', err);
      throw err;
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
      await SecureStore.deleteItemAsync('anonymousUserId');
      await SecureStore.deleteItemAsync('anonymousUserSecret');

      const userDetails = await getUserDetails();

      await SecureStore.setItemAsync('userId', userDetails.userId);

      if (userDetails.setupComplete) {
        router.replace('/');
      } else {
        router.replace('/(setup)/welcomeTab');
      }
    } catch (err) {
      console.error('Error during login in auth context:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await deleteStoredTokens();
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
      const storedRefreshToken = await getStoredRefreshToken();
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
      await deleteAllStoredItems();
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/signIn');
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  async function deleteAllStoredItems() {
    const keys = [
      'accessToken',
      'refreshToken',
      'userId',
      'anonymousUserId',
      'anonymousUserSecret',
    ];
    keys.forEach(async (key) => {
      await SecureStore.deleteItemAsync(key);
    });
  }

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
        registerAnonymousUser,
        upgradeAnonymousUser,
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
