
// API configuration
export const API_CONFIG = {
  baseUrl: 'https://your-api-gateway-url.amazonaws.com/stage', // REPLACE THIS WITH YOUR ACTUAL API GATEWAY URL
  apiKey: 'your-api-key-here' // REPLACE THIS WITH YOUR ACTUAL API KEY
};

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_CONFIG.apiKey
});
