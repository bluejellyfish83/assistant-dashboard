
// Define the Webhook interface
export interface Webhook {
    webhook_id: string;
    webhook_url: string;
    secret: string;
    created_at: number;
    assistant_id: string;
    name: string;
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
      const allWebhooks = await this.listWebhooks();
      return allWebhooks.filter(webhook => webhook.assistant_id === assistantId);
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
