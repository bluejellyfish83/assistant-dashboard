
// API configuration
export const API_CONFIG = {
  baseUrl: 'https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev',
  apiKey: 'F8AD4hf2NV97e4qpypVer7vf6btsTbpM8UwzFuMe',
  timeout: 10000, // 10 second timeout
  retries: 3
};

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_CONFIG.apiKey
});
