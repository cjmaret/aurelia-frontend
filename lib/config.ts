import Constants from 'expo-constants';

const config = {
  apiUrl: Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL,
};

console.log('Config:', config);

export default config;
