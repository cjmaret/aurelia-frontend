import Constants from 'expo-constants';

const config = {
  apiUrl: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL,
};

console.log('EAS API URL:', config.apiUrl);

export default config;
