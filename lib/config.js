export const config = {
  apiUrl:
    process.env.REACT_APP_ENV === 'production'
      ? process.env.REACT_APP_API_URL
      : process.env.REACT_APP_API_URL_EXPO,
};

export default config;
