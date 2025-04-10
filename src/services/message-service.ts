
export interface Message {
  message_id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
}

// Mock implementation - replace with actual API calls when ready
export const messageService = {
  // Get messages from a thread
  async getMessages(threadId: string): Promise<Message[]> {
    console.log('Mock: Fetching messages for thread', threadId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        message_id: `msg_${Math.random().toString(36).substring(2, 10)}`,
        thread_id: threadId,
        role: 'user',
        content: 'Hello, how can you help me today?',
        created_at: Date.now() / 1000 - 120
      },
      {
        message_id: `msg_${Math.random().toString(36).substring(2, 10)}`,
        thread_id: threadId,
        role: 'assistant',
        content: 'I can help you with product recommendations, order support, and answering questions about our services.',
        created_at: Date.now() / 1000 - 60
      }
    ];
  },
  
  // Add a message to a thread
  async addMessage(threadId: string, content: string, role: 'user' | 'assistant' = 'user'): Promise<Message> {
    console.log('Mock: Adding message to thread', threadId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      message_id: `msg_${Math.random().toString(36).substring(2, 10)}`,
      thread_id: threadId,
      role,
      content,
      created_at: Date.now() / 1000
    };
  }
};

/**
 * TODO: Replace with actual API implementation
 */
