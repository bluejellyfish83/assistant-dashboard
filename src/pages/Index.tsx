
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

  // Fetch assistants with improved error handling and reduced retry logic
  const { data: assistants = [], isLoading, error, refetch } = useQuery({
    queryKey: ['assistants'],
    queryFn: () => {
      console.log('Initiating API request to fetch assistants');
      return assistantService.getAssistants();
    },
    retry: 1, // Reduced retries to prevent excessive API calls
    retryDelay: 2000, // 2 second delay between retries
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  // Handle API errors with more detailed error reporting
  useEffect(() => {
    if (error) {
      console.error('API Error Details:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown connection error';
        
      // Only show toast for the first error, not for every retry
      if (!isRetrying) {
        toast({
          title: "Connection Issue",
          description: `API connectivity problem: ${errorMessage}. Using cached data.`,
          variant: "destructive",
        });
      }
    }
  }, [error, toast, isRetrying]);

  // Clear assistant creation flag when component unmounts
  useEffect(() => {
    return () => {
      assistantService.clearCreationFlag();
    };
  }, []);

  // Mutations
  const createAssistantMutation = useMutation({
    mutationFn: (assistant: Omit<Assistant, 'assistant_id' | 'created_at' | 'last_used_at'>) => 
      assistantService.createAssistant(assistant),
    onMutate: () => {
      // Set a flag to prevent multiple submissions
      return { timestamp: Date.now() };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast({
        title: "Success",
        description: "Assistant created successfully",
      });
      setShowForm(false);
      setSelectedAssistant(null);
    },
    onError: (error, variables, context) => {
      console.error('Create assistant error:', error);
      // If error is "already in progress", don't show toast
      if (error instanceof Error && error.message.includes('already in progress')) {
        console.log('Ignoring duplicate creation attempt');
        return;
      }
      
      toast({
        title: "Note",
        description: `Assistant created but might have syncing issues: ${(error as Error).message}`,
        variant: "default",
      });
      setShowForm(false);
      setSelectedAssistant(null);
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
        title: "Note",
        description: `Assistant updated but might have syncing issues: ${(error as Error).message}`,
        variant: "default",
      });
      setShowForm(false);
      setSelectedAssistant(null);
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
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast({
        title: "Note",
        description: `Assistant removed but might have syncing issues: ${(error as Error).message}`,
        variant: "default",
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
    
    // Clear any ongoing assistant creation
    assistantService.clearCreationFlag();
    
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
          <Alert variant="default" className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertTitle className="text-orange-700">Connection Status</AlertTitle>
            <AlertDescription className="text-orange-600">
              <p>We're currently using locally cached data. API sync may be limited.</p>
              <button 
                onClick={handleRetry} 
                disabled={isRetrying}
                className="mt-2 text-sm font-medium underline text-orange-700 hover:text-orange-900"
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
