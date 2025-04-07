
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import AssistantList from '@/components/AssistantList';
import AssistantForm from '@/components/AssistantForm';
import WebhookModal from '@/components/WebhookModal';
import { assistantService, ApiAssistant } from '@/services/assistant-service';
import { useToast } from '@/hooks/use-toast';

// Define the Assistant interface with all required properties
type Assistant = ApiAssistant;

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [webhookAssistant, setWebhookAssistant] = useState<Assistant | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch assistants
  const { data: assistants = [], isLoading, error } = useQuery({
    queryKey: ['assistants'],
    queryFn: assistantService.getAssistants,
  });

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `Failed to load assistants: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

        {showForm ? (
          <AssistantForm
            assistant={selectedAssistant}
            onSave={handleSaveAssistant}
            onCancel={handleCancelEdit}
          />
        ) : (
          <AssistantList
            assistants={assistants}
            isLoading={isLoading}
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
