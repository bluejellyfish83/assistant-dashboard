
// API configuration
export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL, // REPLACE THIS WITH YOUR ACTUAL API GATEWAY URL
  apiKey: process.env.REACT_APP_API_KEY // REPLACE THIS WITH YOUR ACTUAL API KEY
};

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_CONFIG.apiKey
});
