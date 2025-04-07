import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import AssistantList from '@/components/AssistantList';
import AssistantForm from '@/components/AssistantForm';
import WebhookModal from '@/components/WebhookModal';
import { assistantService, ApiAssistant } from '@/services/assistant-service';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

// Define the Assistant interface with all required properties
type Assistant = ApiAssistant;

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [webhookAssistant, setWebhookAssistant] = useState<Assistant | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch assistants
  const { data: assistants = [], isLoading, error, refetch } = useQuery({
    queryKey: ['assistants'],
    queryFn: () => {
      console.log('Initiating API request to fetch assistants');
      return assistantService.getAssistants();
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error('API Error Details:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown connection error';
        
      if (!isRetrying) {
        toast({
          title: "Connection Issue",
          description: `API connectivity problem: ${errorMessage}. Please retry.`,
          variant: "destructive",
        });
      }
    }
  }, [error, toast, isRetrying]);

  // Mutations
  const createAssistantMutation = useMutation({
    mutationFn: (assistant: Omit<Assistant, 'assistant_id' | 'created_at' | 'last_used_at'>) => 
      assistantService.createAssistant(assistant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast({
        title: "Success",
        description: "Assistant created successfully",
      });
      setShowForm(false);
      setSelectedAssistant(null);
    },
    onError: (error) => {
      console.error('Create assistant error:', error);
      toast({
        title: "Error",
        description: `Failed to create assistant: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const updateAssistantMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Assistant> }) => 
      assistantService.updateAssistant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast({
        title: "Success",
        description: "Assistant updated successfully",
      });
      setShowForm(false);
      setSelectedAssistant(null);
    },
    onError: (error) => {
      console.error('Update assistant error:', error);
      toast({
        title: "Error",
        description: `Failed to update assistant: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const deleteAssistantMutation = useMutation({
    mutationFn: (assistantId: string) => assistantService.deleteAssistant(assistantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast({
        title: "Success",
        description: "Assistant deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete assistant error:', error);
      toast({
        title: "Error",
        description: `Failed to delete assistant: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  });

  const handleEditAssistant = (assistant: Assistant | null) => {
    setSelectedAssistant(assistant);
    setShowForm(true);
  };

  const handleSaveAssistant = (assistant: Assistant) => {
    if (assistant.assistant_id && assistants.some(a => a.assistant_id === assistant.assistant_id)) {
      // Update existing assistant
      updateAssistantMutation.mutate({
        id: assistant.assistant_id,
        data: assistant
      });
    } else {
      // Create new assistant
      const { assistant_id, created_at, last_used_at, ...assistantData } = assistant;
      createAssistantMutation.mutate(assistantData as Omit<Assistant, 'assistant_id' | 'created_at' | 'last_used_at'>);
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setSelectedAssistant(null);
  };

  const handleShowWebhook = (assistant: Assistant) => {
    setWebhookAssistant(assistant);
    setShowWebhookModal(true);
  };

  const handleCloseWebhookModal = () => {
    setShowWebhookModal(false);
  };

  const handleDeleteAssistant = (assistantId: string) => {
    deleteAssistantMutation.mutate(assistantId);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    refetch().finally(() => setIsRetrying(false));
    
    toast({
      title: "Retrying connection",
      description: "Attempting to reconnect to the API...",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Assistant Management</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and connect your AI assistants to ManyChat.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              <p>Unable to connect to the API. Please check your network connection.</p>
              <button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="mt-2 text-sm font-medium underline text-white"
              >
                {isRetrying ? "Connecting..." : "Try reconnecting"}
              </button>
            </AlertDescription>
          </Alert>
        )}

        {showForm ? (
          <AssistantForm
            assistant={selectedAssistant}
            onSave={handleSaveAssistant}
            onCancel={handleCancelEdit}
          />
        ) : (
          <AssistantList
            assistants={assistants}
            isLoading={isLoading || isRetrying}
            onEdit={handleEditAssistant}
            onWebhook={handleShowWebhook}
            onDelete={handleDeleteAssistant}
          />
        )}
      </div>

      <WebhookModal
        assistant={webhookAssistant}
        open={showWebhookModal}
        onClose={handleCloseWebhookModal}
      />
    </div>
  );
};

export default Index;
