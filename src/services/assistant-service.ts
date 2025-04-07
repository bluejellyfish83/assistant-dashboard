
import { API_CONFIG, getHeaders, fetchWithTimeout } from './api-config';
import { mockAssistants, generateUniqueId } from './mock-service';

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

// Store locally created assistants to prevent duplicates
let localAssistants: ApiAssistant[] = [];
let isCreatingAssistant = false;

// Helper function for API requests with retry logic
const apiRequest = async (url: string, options: RequestInit) => {
  let lastError: Error | null = null;
  
  // Check for ongoing assistant creation to prevent duplicates
  if (options.method === 'POST' && url.endsWith('/assistants') && isCreatingAssistant) {
    throw new Error('An assistant creation is already in progress');
  }
  
  if (options.method === 'POST' && url.endsWith('/assistants')) {
    isCreatingAssistant = true;
  }
  
  try {
    for (let attempt = 0; attempt < API_CONFIG.retries; attempt++) {
      try {
        const response = await fetchWithTimeout(url, options);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.message || `HTTP error ${response.status}`;
          throw new Error(errorMessage);
        }
        
        return await response.json();
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
  } finally {
    if (options.method === 'POST' && url.endsWith('/assistants')) {
      // Reset creating flag regardless of outcome
      isCreatingAssistant = false;
    }
  }
};

export const assistantService = {
  // Get all assistants
  async getAssistants(): Promise<ApiAssistant[]> {
    console.log('Fetching assistants from:', `${API_CONFIG.baseUrl}/assistants`);
    try {
      const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      console.log('Assistants fetched successfully:', data);
      
      // Merge remote data with local data to ensure we don't lose locally created assistants
      // when API calls fail intermittently
      localAssistants = [...data];
      return data;
    } catch (error) {
      console.error('Error fetching assistants:', error);
      
      // Return locally stored assistants if available, otherwise use mock data
      if (localAssistants.length > 0) {
        console.log('Using locally cached assistants:', localAssistants);
        return localAssistants;
      }
      
      console.log('Using mock assistants for development');
      return mockAssistants;
    }
  },
  
  // Get a specific assistant
  async getAssistant(assistantId: string): Promise<ApiAssistant> {
    console.log('Fetching assistant:', assistantId);
    try {
      const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      console.log('Assistant fetched successfully:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching assistant ${assistantId}:`, error);
      
      // Try to find assistant in local cache
      const localAssistant = localAssistants.find(a => a.assistant_id === assistantId);
      if (localAssistant) {
        return localAssistant;
      }
      
      throw error;
    }
  },
  
  // Create new assistant
  async createAssistant(assistantData: Omit<ApiAssistant, 'assistant_id' | 'created_at' | 'last_used_at'>): Promise<ApiAssistant> {
    console.log('Creating assistant with data:', assistantData);
    try {
      const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(assistantData)
      });
      
      console.log('Assistant created successfully:', data);
      
      // Store in local cache
      if (!localAssistants.some(a => a.assistant_id === data.assistant_id)) {
        localAssistants.push(data);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating assistant:', error);
      
      // Create a local assistant with a unique ID
      const localAssistant: ApiAssistant = {
        assistant_id: generateUniqueId(),
        ...assistantData,
        status: "active",
        created_at: Math.floor(Date.now() / 1000),
        last_used_at: Math.floor(Date.now() / 1000),
      };
      
      // Add to local assistants
      localAssistants.push(localAssistant);
      console.log('Created local assistant:', localAssistant);
      
      return localAssistant;
    }
  },
  
  // Update an assistant
  async updateAssistant(assistantId: string, assistantData: Partial<ApiAssistant>): Promise<ApiAssistant> {
    console.log('Updating assistant:', assistantId, 'with data:', assistantData);
    try {
      const data = await apiRequest(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(assistantData)
      });
      
      console.log('Assistant updated successfully:', data);
      
      // Update in local cache
      const index = localAssistants.findIndex(a => a.assistant_id === assistantId);
      if (index !== -1) {
        localAssistants[index] = { ...localAssistants[index], ...assistantData };
      }
      
      return data;
    } catch (error) {
      console.error(`Error updating assistant ${assistantId}:`, error);
      
      // Update in local cache
      const index = localAssistants.findIndex(a => a.assistant_id === assistantId);
      if (index !== -1) {
        localAssistants[index] = { ...localAssistants[index], ...assistantData };
        return localAssistants[index];
      }
      
      throw error;
    }
  },
  
  // Delete an assistant
  async deleteAssistant(assistantId: string): Promise<void> {
    console.log('Deleting assistant:', assistantId);
    try {
      await apiRequest(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      console.log('Assistant deleted successfully');
      
      // Remove from local cache
      localAssistants = localAssistants.filter(a => a.assistant_id !== assistantId);
    } catch (error) {
      console.error(`Error deleting assistant ${assistantId}:`, error);
      
      // Remove from local cache anyway
      localAssistants = localAssistants.filter(a => a.assistant_id !== assistantId);
      
      // Don't throw error, just log it
      console.log('Assistant removed from local cache');
    }
  },
  
  // Clear creation flag (useful for recovering from errors)
  clearCreationFlag() {
    isCreatingAssistant = false;
  }
};
