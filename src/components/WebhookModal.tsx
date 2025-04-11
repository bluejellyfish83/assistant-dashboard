import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { webhookService, Webhook } from '@/services/webhook-service';

interface Assistant {
  assistant_id: string;
  name: string;
}

interface WebhookModalProps {
  assistant: Assistant | null;
  open: boolean;
  onClose: () => void;
}

const WebhookModal: React.FC<WebhookModalProps> = ({ assistant, open, onClose }) => {
  const [webhook, setWebhook] = useState<Webhook | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open && assistant) {
      generateWebhook();
    }
  }, [open, assistant]);

  const generateWebhook = async () => {
    if (!assistant) return;
    
    setLoading(true);
    try {
      const newWebhook = await webhookService.createWebhook({
        assistant_id: assistant.assistant_id,
        name: `Webhook for ${assistant.name}`
      });
      setWebhook(newWebhook);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate webhook. Please try again.",
        variant: "destructive",
      });
      console.error('Webhook generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${itemName} copied to clipboard`,
    });
  };

  if (!assistant) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Webhook for {assistant.name}</DialogTitle>
          <DialogDescription>
            Use this webhook to connect your assistant to ManyChat.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : webhook ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex space-x-2">
                <Input id="webhook-url" readOnly value={webhook.webhook_url} />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(webhook.webhook_url, "Webhook URL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Secret Key</Label>
              <div className="flex space-x-2">
                <Input
                  id="webhook-secret"
                  type={showSecret ? "text" : "password"}
                  readOnly
                  value={showSecret ? webhook.secret : "••••••••••••••••••••••••••••••••"}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(webhook.secret, "Secret Key")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">ManyChat Configuration:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>In ManyChat, create a new 'External Request' node</li>
                <li>Set Request Type to <code className="bg-muted px-1 py-0.5 rounded">POST</code></li>
                <li>Set Request URL to the Webhook URL above</li>
                <li>Add the following headers:
                  <ul className="list-disc list-inside ml-5 mt-1">
                    <li><code className="bg-muted px-1 py-0.5 rounded">Content-Type</code>: <code className="bg-muted px-1 py-0.5 rounded">application/json</code></li>
                    <li><code className="bg-muted px-1 py-0.5 rounded">X-Webhook-Secret</code>: <code className="bg-muted px-1 py-0.5 rounded">{showSecret ? webhook.secret : "••••••••••••••••••••••"}</code></li>
                  </ul>
                </li>
                <li>Set the Body to the JSON format below</li>
              </ol>
              
              <div className="rounded-md bg-muted p-4 mt-2">
                <pre className="text-xs overflow-auto">
{`{
  "message": "{{last_input_text}}",
  "threadId": "{{cuf_12794143}}",
  "type": "user_message"
}`}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Failed to generate webhook. Please try again.
          </div>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={generateWebhook} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Regenerate Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookModal;
