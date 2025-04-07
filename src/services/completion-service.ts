
import { API_CONFIG, getHeaders } from './api-config';
import { Message } from './message-service';

export interface CompletionRequest {
  assistant_id: string;
  temperature?: number;
  max_tokens?: number;
}

export interface Completion {
  message: Message;
}

export const completionService = {
  // Generate a completion
  async createCompletion(threadId: string, request: CompletionRequest): Promise<Completion> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/threads/${threadId}/completions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate completion');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error generating completion for thread ${threadId}:`, error);
      throw error;
    }
  }
};
