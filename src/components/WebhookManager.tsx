
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, Trash2, Plus, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { webhookService, Webhook } from '@/services/webhook-service';

interface Assistant {
  assistant_id: string;
  name: string;
}

interface WebhookManagerProps {
  assistant: Assistant | null;
  open: boolean;
  onClose: () => void;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ assistant, open, onClose }) => {
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch webhooks for this assistant
  const { data: webhooks = [], isLoading, refetch } = useQuery({
    queryKey: ['webhooks', assistant?.assistant_id],
    queryFn: () => {
      if (!assistant) return Promise.resolve([]);
      console.log('WebhookManager: Executing query function for assistant:', assistant.assistant_id);
      return webhookService.listWebhooksByAssistant(assistant.assistant_id);
    },
    enabled: !!assistant && open,
    staleTime: 0, // Don't use cached data
    refetchOnMount: true, // Always refetch when component mounts
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open && assistant) {
      setShowSecrets({});
      setIsCreating(false);
      setNewWebhookName('');
    }
  }, [open, assistant]);

  useEffect(() => {
    if (open && assistant) {
      console.log('WebhookManager: Invalidating and refetching webhooks for assistant:', assistant.assistant_id);
      // Force invalidate any cached data
      queryClient.invalidateQueries({ queryKey: ['webhooks', assistant.assistant_id] });
      // Manually trigger a refetch
      refetch();
    }
  }, [open, assistant, queryClient, refetch]);

  // Create webhook mutation
  const createWebhookMutation = useMutation({
    mutationFn: webhookService.createWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', assistant?.assistant_id] });
      toast({
        title: "Success",
        description: "Webhook created successfully",
      });
      setIsCreating(false);
      setNewWebhookName('');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create webhook: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  // Delete webhook mutation
  const deleteWebhookMutation = useMutation({
    mutationFn: webhookService.deleteWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', assistant?.assistant_id] });
      toast({
        title: "Success",
        description: "Webhook deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete webhook: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const handleCreateWebhook = async () => {
    if (!assistant) return;
    if (!newWebhookName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the webhook",
        variant: "destructive",
      });
      return;
    }

    createWebhookMutation.mutate({
      assistant_id: assistant.assistant_id,
      name: newWebhookName.trim()
    });
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (confirm("Are you sure you want to delete this webhook? This action cannot be undone.")) {
      deleteWebhookMutation.mutate(webhookId);
    }
  };

  const toggleSecretVisibility = (webhookId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [webhookId]: !prev[webhookId]
    }));
  };

  const copyToClipboard = async (text: string, itemName: string) => {
    if (!text || text === 'undefined') {
      toast({
        title: "Error",
        description: `No ${itemName} available to copy`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Modern clipboard API with better browser support
      await navigator.clipboard.writeText(text);
      
      toast({
        title: "Copied!",
        description: `${itemName} copied to clipboard`,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      
      // Fallback method if clipboard API fails
      try {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        toast({
          title: "Copied!",
          description: `${itemName} copied to clipboard`,
        });
      } catch (fallbackErr) {
        console.error('Fallback copy method failed: ', fallbackErr);
        toast({
          title: "Error",
          description: `Failed to copy ${itemName} to clipboard: ${(err as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  if (!assistant) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Webhooks for {assistant.name}</DialogTitle>
          <DialogDescription>
            Manage webhooks for this assistant to connect to various platforms.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {webhooks.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Webhook URL</TableHead>
                      <TableHead>Secret Key</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.webhook_id}>
                        <TableCell className="font-medium">{webhook.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{webhook.webhook_url || ''}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(webhook.webhook_url || '', "Webhook URL")}
                              type="button"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input
                              type={showSecrets[webhook.webhook_id] ? "text" : "password"}
                              readOnly
                              value={webhook.secret || webhook.webhook_secret || ''}
                              className="max-w-[140px]"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSecretVisibility(webhook.webhook_id)}
                              type="button"
                            >
                              {showSecrets[webhook.webhook_id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(webhook.secret || webhook.webhook_secret || '', "Secret Key")}
                              type="button"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(webhook.created_at * 1000).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteWebhook(webhook.webhook_id)}
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                <Link className="h-8 w-8 mx-auto text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium">No webhooks configured</h3>
                <p className="text-sm text-muted-foreground">
                  Create a webhook to connect your assistant to external platforms.
                </p>
              </div>
            )}

            {isCreating ? (
              <div className="space-y-4 border rounded-md p-4">
                <h3 className="text-md font-medium">Create New Webhook</h3>
                <div className="space-y-2">
                  <Label htmlFor="webhook-name">Webhook Name</Label>
                  <Input
                    id="webhook-name"
                    placeholder="e.g., ManyChat Production"
                    value={newWebhookName}
                    onChange={(e) => setNewWebhookName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button 
                    onClick={handleCreateWebhook} 
                    disabled={createWebhookMutation.isPending}
                  >
                    {createWebhookMutation.isPending ? "Creating..." : "Create Webhook"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsCreating(true)} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Webhook
              </Button>
            )}

            <div className="rounded-md bg-muted p-4">
              <h3 className="text-sm font-medium mb-2">ManyChat Configuration:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>In ManyChat, create a new 'External Request' node</li>
                <li>Set Request Type to <code className="bg-muted/50 px-1 py-0.5 rounded">POST</code></li>
                <li>Set Request URL to the Webhook URL</li>
                <li>Add the following headers:
                  <ul className="list-disc list-inside ml-5 mt-1">
                    <li><code className="bg-muted/50 px-1 py-0.5 rounded">Content-Type</code>: <code className="bg-muted/50 px-1 py-0.5 rounded">application/json</code></li>
                    <li><code className="bg-muted/50 px-1 py-0.5 rounded">X-Webhook-Secret</code>: <code className="bg-muted/50 px-1 py-0.5 rounded">your-secret-key</code></li>
                  </ul>
                </li>
                <li>Set the Body to the JSON format below</li>
              </ol>
              
              <div className="rounded-md bg-muted/50 p-4 mt-2">
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
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookManager;
