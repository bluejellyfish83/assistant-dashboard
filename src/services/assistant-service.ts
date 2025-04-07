
import { API_CONFIG, getHeaders } from './api-config';

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

export const assistantService = {
  // Get all assistants
  async getAssistants(): Promise<ApiAssistant[]> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch assistants');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching assistants:', error);
      throw error;
    }
  },
  
  // Get a specific assistant
  async getAssistant(assistantId: string): Promise<ApiAssistant> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch assistant');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching assistant ${assistantId}:`, error);
      throw error;
    }
  },
  
  // Create new assistant
  async createAssistant(assistantData: Omit<ApiAssistant, 'assistant_id' | 'created_at' | 'last_used_at'>): Promise<ApiAssistant> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(assistantData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create assistant');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating assistant:', error);
      throw error;
    }
  },
  
  // Update an assistant
  async updateAssistant(assistantId: string, assistantData: Partial<ApiAssistant>): Promise<ApiAssistant> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(assistantData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update assistant');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating assistant ${assistantId}:`, error);
      throw error;
    }
  },
  
  // Delete an assistant
  async deleteAssistant(assistantId: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete assistant');
      }
    } catch (error) {
      console.error(`Error deleting assistant ${assistantId}:`, error);
      throw error;
    }
  }
};
