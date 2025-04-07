
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
    console.log('Fetching assistants from:', `${API_CONFIG.baseUrl}/assistants`);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.message || `Failed to fetch assistants: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Assistants fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching assistants:', error);
      throw error;
    }
  },
  
  // Get a specific assistant
  async getAssistant(assistantId: string): Promise<ApiAssistant> {
    console.log('Fetching assistant:', assistantId);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.message || `Failed to fetch assistant: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Assistant fetched successfully:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching assistant ${assistantId}:`, error);
      throw error;
    }
  },
  
  // Create new assistant
  async createAssistant(assistantData: Omit<ApiAssistant, 'assistant_id' | 'created_at' | 'last_used_at'>): Promise<ApiAssistant> {
    console.log('Creating assistant with data:', assistantData);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(assistantData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.message || `Failed to create assistant: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Assistant created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating assistant:', error);
      throw error;
    }
  },
  
  // Update an assistant
  async updateAssistant(assistantId: string, assistantData: Partial<ApiAssistant>): Promise<ApiAssistant> {
    console.log('Updating assistant:', assistantId, 'with data:', assistantData);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(assistantData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.message || `Failed to update assistant: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Assistant updated successfully:', data);
      return data;
    } catch (error) {
      console.error(`Error updating assistant ${assistantId}:`, error);
      throw error;
    }
  },
  
  // Delete an assistant
  async deleteAssistant(assistantId: string): Promise<void> {
    console.log('Deleting assistant:', assistantId);
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/assistants/${assistantId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', response.status, errorData);
        throw new Error(errorData.message || `Failed to delete assistant: ${response.status}`);
      }
      
      console.log('Assistant deleted successfully');
    } catch (error) {
      console.error(`Error deleting assistant ${assistantId}:`, error);
      throw error;
    }
  }
};
