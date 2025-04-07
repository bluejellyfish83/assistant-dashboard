
import { API_CONFIG, getHeaders, fetchWithTimeout } from './api-config';

// Define the Assistant interface
export interface ApiAssistant {
  assistant_id: string;
  name: string;
  description: string;
  system_prompt: string;
  default_model: string;
  default_temperature: number;
  default_max_tokens: number;
  status: string;
  created_at: number;
  last_used_at: number;
}

// Helper function for API requests with retry logic
const apiRequest = async (url: string, options: RequestInit) => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < API_CONFIG.retries; attempt++) {
    try {
      console.log(`API request attempt ${attempt + 1}/${API_CONFIG.retries} to ${url}`);
      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log(`API request successful:`, data);
      return data;
    } catch (error) {
      console.error(`API request attempt ${attempt + 1}/${API_CONFIG.retries} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't wait on the last attempt
      if (attempt < API_CONFIG.retries - 1) {
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Request failed after multiple attempts');
};

export const assistantService = {
  // Get all assistants
  async getAssistants(): Promise<ApiAssistant[]> {
    console.log('Fetching assistants from:', `${API_CONFIG.baseUrl}/assistants`);
    const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    console.log('Assistants fetched successfully:', data);
    return data;
  },
  
  // Get a specific assistant
  async getAssistant(assistantId: string): Promise<ApiAssistant> {
    console.log('Fetching assistant:', assistantId);
    const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    console.log('Assistant fetched successfully:', data);
    return data;
  },
  
  // Create new assistant
  async createAssistant(assistantData: Omit<ApiAssistant, 'assistant_id' | 'created_at' | 'last_used_at'>): Promise<ApiAssistant> {
    console.log('Creating assistant with data:', assistantData);
    const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(assistantData)
    });
    
    console.log('Assistant created successfully:', data);
    return data;
  },
  
  // Update an assistant
  async updateAssistant(assistantId: string, assistantData: Partial<ApiAssistant>): Promise<ApiAssistant> {
    console.log('Updating assistant:', assistantId, 'with data:', assistantData);
    const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(assistantData)
    });
    
    console.log('Assistant updated successfully:', data);
    return data;
  },
  
  // Delete an assistant
  async deleteAssistant(assistantId: string): Promise<void> {
    console.log('Deleting assistant:', assistantId);
    await apiRequest(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    console.log('Assistant deleted successfully');
  }
};
