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

  _returnRes(res: any) {
    if (res.ok) {
      return res.json();
    } else if (res.status === 401) {
      throw new Error('Token has expired');
    } else {
      return Promise.reject(`Error: ${res.status} ${res.statusText}`);
    }
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await fetch(`${config.apiUrlExpo}/auth/refresh`, {
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
      const response = await fetch(`${config.apiUrlExpo}/register`, {
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
    try {
      const response = await fetch(`${config.apiUrlExpo}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();

      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Tokens are missing');
      }

      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error) {
      console.error('Error during login in api:', error);
      throw error;
    }
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

  async getCorrections(): Promise<CorrectionResponseType> {
    const headers = await this._getAuthHeaders();

    return fetch(this._baseUrl + `/corrections`, {
      method: 'GET',
      headers,
    })
      .then((res) => this._returnRes(res))
      .catch((err) => {
        console.error('Error fetching corrections:', err);
        throw err;
      });
  }

  async sendAudioFile(formData: FormData): Promise<CorrectionResponseType> {
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
}

const api = new Api({
  baseUrl: `${config.apiUrlExpo}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
