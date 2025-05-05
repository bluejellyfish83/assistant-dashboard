/**
 * Centralized configuration for API services
 * This file manages all environment variables in one place
 */

// Log environment variables for debugging during development
// const logEnvVars = () => {
//   if (import.meta.env.DEV) {
//     console.log('Environment Configuration:');
//     console.log('- API_BASE_URL:', import.meta.env.VITE_API_BASE_URL || '(using fallback)');
//     console.log('- API_KEY present:', !!import.meta.env.VITE_API_KEY);
//   }
// };

// // Call this once at startup
// logEnvVars();

// Export configuration as constants
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev',
  API_KEY: import.meta.env.VITE_API_KEY || '',

  
  // Helper method for creating standard headers
  getHeaders(includeContentType = true): HeadersInit {
    const headers: HeadersInit = {};
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.API_KEY) {
      headers['x-api-key'] = this.API_KEY;
    }
    
    return headers;
  }
};