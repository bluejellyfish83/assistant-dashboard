
export interface Thread {
  thread_id: string;
  created_at: number;
}

// Mock implementation - replace with actual API calls when ready
export const threadService = {
  // Create a new thread
  async createThread(): Promise<Thread> {
    console.log('Mock: Creating thread');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      thread_id: `thread_${Math.random().toString(36).substring(2, 10)}`,
      created_at: Date.now() / 1000
    };
  },
  
  // Delete a thread
  async deleteThread(threadId: string): Promise<void> {
    console.log('Mock: Deleting thread:', threadId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

/**
 * TODO: Replace with actual API implementation
 */
