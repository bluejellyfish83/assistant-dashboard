
import { API_CONFIG, getHeaders } from './api-config';

export interface Thread {
  thread_id: string;
  created_at: number;
}

export const threadService = {
  // Create a new thread
  async createThread(): Promise<Thread> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/threads`, {
        method: 'POST',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create thread');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  },
  
  // Delete a thread
  async deleteThread(threadId: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/threads/${threadId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete thread');
      }
    } catch (error) {
      console.error(`Error deleting thread ${threadId}:`, error);
      throw error;
    }
  }
};
