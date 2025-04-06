
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AssistantList from '@/components/AssistantList';
import AssistantForm from '@/components/AssistantForm';
import WebhookModal from '@/components/WebhookModal';

// Define the Assistant interface
interface Assistant {
  assistant_id: string;
  name: string;
  description: string;
  default_model: string;
  status: string;
  created_at: number;
  last_used_at: number;
}

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [webhookAssistant, setWebhookAssistant] = useState<Assistant | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  const handleEditAssistant = (assistant: Assistant | null) => {
    setSelectedAssistant(assistant);
    setShowForm(true);
  };

  const handleSaveAssistant = () => {
    setShowForm(false);
    setSelectedAssistant(null);
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
            onEdit={handleEditAssistant}
            onWebhook={handleShowWebhook}
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
