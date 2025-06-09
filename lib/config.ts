import Constants from 'expo-constants';

const config = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl,
};

console.log('EAS API URL:', config.apiUrl);

export default config;
