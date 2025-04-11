
// Define the Webhook interface
export interface Webhook {
  webhook_id: string;
  webhook_url: string;
  secret: string; // Keep this name for compatibility with existing code
  webhook_secret?: string; // Add this for the API response
  created_at: number;
  assistant_id: string;
  name: string;
  status?: string;
  last_used_at?: number;
}

// Define the create webhook request interface
export interface CreateWebhookRequest {
  assistant_id: string;
  name: string;
}

export const webhookService = {
  // Create a new webhook
  async createWebhook(request: CreateWebhookRequest): Promise<Webhook> {
    const response = await fetch('https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev/webhooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create webhook');
    }

    return response.json();
  },

  // List all webhooks
  async listWebhooks(): Promise<Webhook[]> {
    const response = await fetch('https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev/webhooks');

    if (!response.ok) {
      throw new Error('Failed to fetch webhooks');
    }

    return response.json();
  },

  // List webhooks by assistant ID
  async listWebhooksByAssistant(assistantId: string): Promise<Webhook[]> {
    console.log('Calling listWebhooksByAssistant with ID:', assistantId);
    const url = `https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev/assistants/${assistantId}/webhooks`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch webhooks for assistant');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    // Extract the webhooks array from the response and map the fields correctly
    if (data && data.webhooks && Array.isArray(data.webhooks)) {
      return data.webhooks.map(webhook => ({
        ...webhook,
        secret: webhook.webhook_secret || webhook.secret || '' // Ensure secret is always available
      }));
    } else {
      console.error('Unexpected response format:', data);
      return [];
    }
  },

  // Delete a webhook
  async deleteWebhook(webhookId: string): Promise<void> {
    const response = await fetch(`https://0675fyl2a3.execute-api.ap-east-1.amazonaws.com/dev/webhooks/${webhookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete webhook');
    }
  }
};
