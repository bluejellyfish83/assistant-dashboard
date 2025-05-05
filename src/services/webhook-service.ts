// Define the Webhook interface
import { API_CONFIG } from '../lib/config';

export interface Webhook {
  webhook_id: string;
  webhook_url: string;
  secret: string;
  webhook_secret?: string;
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

// Use environment variables for API configuration
const API_BASE_URL = API_CONFIG.BASE_URL;
const API_KEY = API_CONFIG.API_KEY;

// Create headers function to ensure consistent headers across all requests
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }
  
  return headers;
};

export const webhookService = {
  // Create a new webhook
  async createWebhook(request: CreateWebhookRequest): Promise<Webhook> {
    const response = await fetch(`${API_BASE_URL}/webhooks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create webhook: ${errorText}`);
    }

    const webhook = await response.json();
    return {
      ...webhook,
      secret: webhook.webhook_secret || webhook.secret || ''
    };
  },

  // List all webhooks
  async listWebhooks(): Promise<Webhook[]> {
    const response = await fetch(`${API_BASE_URL}/webhooks`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch webhooks');
    }

    return response.json();
  },

  // List webhooks by assistant ID
  async listWebhooksByAssistant(assistantId: string): Promise<Webhook[]> {
    console.log('Fetching webhooks for assistant:', assistantId);
    const url = `${API_BASE_URL}/assistants/${assistantId}/webhooks`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch webhooks for assistant');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    // Extract the webhooks array from the response and map the fields correctly
    if (data && data.webhooks && Array.isArray(data.webhooks)) {
      return data.webhooks.map(webhook => ({
        ...webhook,
        secret: webhook.webhook_secret || webhook.secret || ''
      }));
    } else {
      console.error('Unexpected response format:', data);
      return [];
    }
  },

  // Delete a webhook
  async deleteWebhook(webhookId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/webhooks/${webhookId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete webhook');
    }
  }
};
