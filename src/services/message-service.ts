
import { API_CONFIG, getHeaders } from './api-config';

export interface Message {
  message_id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
}

export const messageService = {
  // Get messages from a thread
  async getMessages(threadId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/threads/${threadId}/messages`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch messages');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching messages for thread ${threadId}:`, error);
      throw error;
    }
  },
  
  // Add a message to a thread
  async addMessage(threadId: string, content: string, role: 'user' | 'assistant' = 'user'): Promise<Message> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/threads/${threadId}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content, role })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add message');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error adding message to thread ${threadId}:`, error);
      throw error;
    }
  }
};
