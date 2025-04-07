
// Sample assistant data for fallback when API is unavailable
export const mockAssistants = [
  {
    assistant_id: "assistant-demo-1",
    name: "Demo Assistant",
    description: "This is a demo assistant for development purposes",
    system_prompt: "You are a helpful AI assistant.",
    default_model: "anthropic/claude-3-haiku",
    default_temperature: 0.7,
    default_max_tokens: 1000,
    status: "active",
    created_at: Math.floor(Date.now() / 1000) - 86400, // yesterday
    last_used_at: Math.floor(Date.now() / 1000) - 3600, // an hour ago
  }
];

// Utility to create unique IDs
export const generateUniqueId = () => {
  return `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};
