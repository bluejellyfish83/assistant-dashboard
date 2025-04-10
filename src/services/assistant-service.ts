
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

// Sample data for development purposes
const sampleAssistants: ApiAssistant[] = [
  {
    assistant_id: "asst_1",
    name: "Customer Support Assistant",
    description: "Helps with customer inquiries and support requests",
    system_prompt: "You are a helpful customer support agent for our e-commerce store.",
    default_model: "gpt-4",
    default_temperature: 0.7,
    default_max_tokens: 500,
    status: "active",
    created_at: Date.now() / 1000 - 86400 * 7, // 7 days ago
    last_used_at: Date.now() / 1000 - 3600 * 2 // 2 hours ago
  },
  {
    assistant_id: "asst_2",
    name: "Product Recommendation Assistant",
    description: "Provides personalized product recommendations",
    system_prompt: "You are a product recommendation specialist that helps users find the perfect items.",
    default_model: "gpt-3.5-turbo",
    default_temperature: 0.8,
    default_max_tokens: 1000,
    status: "active",
    created_at: Date.now() / 1000 - 86400 * 14, // 14 days ago
    last_used_at: Date.now() / 1000 - 86400 * 1 // 1 day ago
  }
];

// Mock service implementation
// Replace these with actual API calls when ready to implement
export const assistantService = {
  // Get all assistants
  async getAssistants(): Promise<ApiAssistant[]> {
    console.log('Mock: Fetching assistants');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [...sampleAssistants];
  },
  
  // Get a specific assistant
  async getAssistant(assistantId: string): Promise<ApiAssistant> {
    console.log('Mock: Fetching assistant:', assistantId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find assistant or throw error
    const assistant = sampleAssistants.find(a => a.assistant_id === assistantId);
    if (!assistant) {
      throw new Error(`Assistant not found: ${assistantId}`);
    }
    
    return { ...assistant };
  },
  
  // Create new assistant
  async createAssistant(assistantData: Omit<ApiAssistant, 'assistant_id' | 'created_at' | 'last_used_at'>): Promise<ApiAssistant> {
    console.log('Mock: Creating assistant with data:', assistantData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Create new assistant with generated ID
    const newAssistant: ApiAssistant = {
      ...assistantData,
      assistant_id: `asst_${Math.random().toString(36).substring(2, 10)}`,
      created_at: Date.now() / 1000,
      last_used_at: Date.now() / 1000
    };
    
    // Add to mock data
    sampleAssistants.push(newAssistant);
    
    return { ...newAssistant };
  },
  
  // Update an assistant
  async updateAssistant(assistantId: string, assistantData: Partial<ApiAssistant>): Promise<ApiAssistant> {
    console.log('Mock: Updating assistant:', assistantId, 'with data:', assistantData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find and update assistant
    const index = sampleAssistants.findIndex(a => a.assistant_id === assistantId);
    if (index === -1) {
      throw new Error(`Assistant not found: ${assistantId}`);
    }
    
    sampleAssistants[index] = {
      ...sampleAssistants[index],
      ...assistantData,
      last_used_at: Date.now() / 1000
    };
    
    return { ...sampleAssistants[index] };
  },
  
  // Delete an assistant
  async deleteAssistant(assistantId: string): Promise<void> {
    console.log('Mock: Deleting assistant:', assistantId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Find and remove assistant
    const index = sampleAssistants.findIndex(a => a.assistant_id === assistantId);
    if (index === -1) {
      throw new Error(`Assistant not found: ${assistantId}`);
    }
    
    sampleAssistants.splice(index, 1);
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
