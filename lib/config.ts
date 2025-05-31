const apiUrls = {
  // local: 'http://192.168.1.104:8000',
  local: 'https://api.aurelialabs.net',
  droplet: 'http://24.144.89.186:8000',
  production: 'https://api.aurelialabs.net',
};

const ENV = process.env.EXPO_PUBLIC_ENV || 'production';

const config = {
  apiUrl: apiUrls[ENV as keyof typeof apiUrls] || apiUrls.production,
};

export default config;