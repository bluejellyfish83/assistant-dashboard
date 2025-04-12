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

// Use environment variables for API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev';
const API_KEY = import.meta.env.VITE_API_KEY || '';

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  throw new Error(error.message || 'An error occurred while calling the API');
};

export const assistantService = {
  // Get all assistants
  async getAssistants(): Promise<ApiAssistant[]> {
    try {
      console.log('Making request to:', `${API_BASE_URL}/assistants`);  // Add logging
      
      const response = await fetch(`${API_BASE_URL}/assistants`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          // Remove content-type header since GET requests don't need it
          // Remove accept header to match curl request
        },
        mode: 'cors',
        credentials: 'omit'
      });

      // Add verbose logging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      
      // Check the structure of the response
      if (!data.assistants) {
        console.error('Unexpected response structure:', data);
        return [];
      }

      return data.assistants;
    } catch (error) {
      console.error('API Error:', error);
      throw error;  // Let the error propagate to show in UI
    }
  },

  // Get a specific assistant
  async getAssistant(assistantId: string): Promise<ApiAssistant> {
    try {
      const response = await fetch(`${API_BASE_URL}/assistants/${assistantId}`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Assistant not found: ${assistantId}`);
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Create new assistant
  async createAssistant(assistantData: Omit<ApiAssistant, 'assistant_id' | 'created_at' | 'last_used_at' | 'status'>): Promise<ApiAssistant> {
    try {
      const response = await fetch(`${API_BASE_URL}/assistants`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assistantData)
      });

      if (!response.ok) {
        throw new Error('Failed to create assistant');
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Update an assistant
  async updateAssistant(assistantId: string, assistantData: Partial<ApiAssistant>): Promise<ApiAssistant> {
    try {
      console.log('Updating assistant with ID:', assistantId);
      console.log('Update data:', assistantData);
      
      const response = await fetch(`${API_BASE_URL}/assistants/${assistantId}`, {
        method: 'PUT',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assistantData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Failed to update assistant: ${assistantId} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Update successful:', data);
      return data;
    } catch (error) {
      console.error('Update error:', error);
      handleApiError(error);
      throw error;
    }
  },

  // Delete an assistant
  async deleteAssistant(assistantId: string): Promise<void> {
    try {
      console.log('Deleting assistant with ID:', assistantId);
      
      // First, delete all related webhooks
      try {
        console.log('Fetching webhooks for assistant before deletion');
        const webhooksResponse = await fetch(`${API_BASE_URL}/assistants/${assistantId}/webhooks`, {
          headers: {
            'x-api-key': API_KEY,
          }
        });
        
        if (webhooksResponse.ok) {
          const webhooksData = await webhooksResponse.json();
          const webhooks = webhooksData.webhooks || [];
          
          console.log(`Found ${webhooks.length} webhooks to delete for assistant ${assistantId}`);
          
          // Delete each webhook
          for (const webhook of webhooks) {
            console.log(`Deleting webhook: ${webhook.webhook_id}`);
            await fetch(`${API_BASE_URL}/webhooks/${webhook.webhook_id}`, {
              method: 'DELETE',
              headers: {
                'x-api-key': API_KEY,
              }
            });
          }
          
          console.log('All webhooks deleted successfully');
        } else {
          console.warn('Could not fetch webhooks before assistant deletion:', await webhooksResponse.text());
        }
      } catch (webhookError) {
        console.error('Error deleting associated webhooks:', webhookError);
        // Continue with assistant deletion even if webhook deletion fails
      }
      
      // Now delete the assistant
      const response = await fetch(`${API_BASE_URL}/assistants/${assistantId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete failed with status:', response.status);
        console.error('Error response:', errorText);
        throw new Error(`Failed to delete assistant: ${assistantId} - ${errorText}`);
      }
      
      console.log('Assistant deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      handleApiError(error);
      throw error;
    }
  }
};

/**
 * TODO: Implementation Notes
 * 
 * To implement real API connectivity:
 * 1. Create an api-config.ts file with your API URL and authentication setup
 * 2. Update each method in this service to make real HTTP requests
 * 3. Add proper error handling for API responses
 * 4. Consider adding retry logic for failed requests
 * 5. Implement request timeouts as needed
 */
