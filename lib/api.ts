import { ApiTypes, CorrectionResponseType } from '@/types/types';
import config from './config';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

class Api {
  private _baseUrl: string | undefined;
  private _headers: any;

  constructor({ baseUrl, headers }: ApiTypes) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  async _getAuthHeaders() {
    const token = await SecureStore.getItemAsync('accessToken');
    if (!token) {
      throw new Error('No access token available');
    }

    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      console.warn('Access token has expired. Attempting to refresh...');
      const storedRefreshToken = await SecureStore.getItemAsync('refreshToken');

      if (!storedRefreshToken) {
        console.error('No refresh token available. Logging out...');
        throw new Error('No refresh token available');
      }

      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await this.refreshToken(storedRefreshToken);

        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        console.log('Access token successfully renewed using refresh token.');
      } catch (error) {
        console.error('Failed to refresh token. Logging out...');
        throw error;
      }
    }

    return {
      ...this._headers,
      Authorization: `Bearer ${token}`,
    };
  }

  _returnRes(res: Response): Promise<any> {
    if (res.ok) {
      return res.json();
    } else {
      return res.json().then((body: any) => {
        const errorMessage =
          body.detail ||
          `Error: ${res.status} ${res.statusText || 'Unknown error'}`;
        return Promise.reject({
          status: res.status,
          message: errorMessage,
        });
      });
    }
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await fetch(`${config.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this._headers,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to refresh token: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  async registerUser(userEmail: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${config.apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during register:', error);
      throw error;
    }
  }

  async authenticateUser(
    userEmail: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return fetch(`${config.apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, password }),
    })
      .then((res) => {
        return this._returnRes(res);
      })
      .catch((err) => {
        console.error('error logging in:', err);
        throw err;
      });
  }

  async requestEmailVerification(): Promise<any> {
    const headers = await this._getAuthHeaders();
    return fetch(`${config.apiUrl}/auth/request-email-verification`, {
      method: 'POST',
      headers,
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error sending verification email:', err);
        throw err;
      });
  }

  // Verify the user's email with a token
  async verifyEmail(token: string): Promise<any> {
    return fetch(`${config.apiUrl}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error verifying email:', err);
        throw err;
      });
  }

  async requestEmailChange({ newEmail }: { newEmail: string }): Promise<any> {
    const headers = await this._getAuthHeaders();
    return fetch(`${this._baseUrl}/user/request-email-change`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ newEmail }),
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error requesting email change:', err);
        throw err;
      });
  }

  async changeEmail({
    token,
    password,
  }: {
    token: string;
    password: string;
  }): Promise<any> {
    const headers = await this._getAuthHeaders();
    return fetch(`${this._baseUrl}/user/change-email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token, password }),
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error confirming email change:', err);
        throw err;
      });
  }

  async getUserDetails(): Promise<any> {
    const headers = await this._getAuthHeaders();

    return fetch(`${this._baseUrl}/user/details`, {
      method: 'GET',
      headers,
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error fetching user details:', err);
        throw err;
      });
  }

  async updateUserDetails(userDetails: {
    username?: string;
    userEmail?: string;
    appLanguage?: string;
    targetLanguage?: string;
    setupComplete?: boolean;
  }): Promise<any> {
    const headers = await this._getAuthHeaders();

    return fetch(`${this._baseUrl}/user/details`, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error updating user details:', err);
        throw err;
      });
  }

  async updateUserPassword({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }): Promise<any> {
    const headers = await this._getAuthHeaders();

    return fetch(`${config.apiUrl}/auth/update-password`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error updating password:', err);
        throw err;
      });
  }

  async requestPasswordReset({
    userEmail,
  }: {
    userEmail: string;
  }): Promise<any> {
    return fetch(`${config.apiUrl}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error requesting password reset:', err);
        throw err;
      });
  }

  async resetPassword({
    token,
    newPassword,
  }: {
    token: string;
    newPassword: string;
  }): Promise<any> {
    return fetch(`${config.apiUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this._headers,
      },
      body: JSON.stringify({ token, newPassword }),
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error resetting password:', err);
        throw err;
      });
  }

  async deleteUser(): Promise<any> {
    const headers = await this._getAuthHeaders();

    return fetch(`${config.apiUrl}/delete-user`, {
      method: 'DELETE',
      headers,
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error deleting user:', err);
        throw err;
      });
  }

  async getCorrections({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<CorrectionResponseType> {
    const headers = await this._getAuthHeaders();

    return fetch(this._baseUrl + `/corrections?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error fetching corrections:', err);
        throw err;
      });
  }

  async searchCorrections({
    query,
    page = 1,
    limit = 0,
  }: {
    query: string;
    page: number;
    limit: number;
  }): Promise<CorrectionResponseType> {
    const headers = await this._getAuthHeaders();

    return fetch(
      `${this._baseUrl}/corrections/search?query=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers,
      }
    )
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error while searching corrections', err);
        throw err;
      });
  }

  async addCorrection(formData: FormData): Promise<CorrectionResponseType> {
    const headers = await this._getAuthHeaders();

    return fetch(this._baseUrl + `/corrections`, {
      method: 'POST',
      headers,
      body: formData,
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error sending audio:', err);
        throw err;
      });
  }

  async deleteConversation({
    conversationId,
  }: {
    conversationId: string;
  }): Promise<CorrectionResponseType> {
    const headers = await this._getAuthHeaders();

    return fetch(this._baseUrl + `/corrections/${conversationId}`, {
      method: 'DELETE',
      headers,
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error deleting correction:', err);
        throw err;
      });
  }
}

const api = new Api({
  baseUrl: `${config.apiUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
