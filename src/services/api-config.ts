
// API configuration
export const API_CONFIG = {
  baseUrl: 'https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev',
  apiKey: 'F8AD4hf2NV97e4qpypVer7vf6btsTbpM8UwzFuMe',
  timeout: 8000, // 8 second timeout
  retries: 2,    // Default number of retries
  corsHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
  }
};

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_CONFIG.apiKey,
  'Accept': 'application/json',
  // Origin header not needed with proper CORS configuration
});

// Helper function to implement fetch with timeout
export const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = API_CONFIG.timeout) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      ...options, 
      signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Fetch error:', error);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
};
