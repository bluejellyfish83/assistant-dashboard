import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiAssistant } from '@/services/assistant-service';

// Define the Assistant interface
type Assistant = ApiAssistant & {
  updated_at?: number;
};

interface AssistantListProps {
  assistants: Assistant[];
  isLoading: boolean;
  onEdit: (assistant: Assistant | null) => void;
  onWebhook: (assistant: Assistant) => void;
  onDelete: (assistantId: string) => void;
}

const AssistantList: React.FC<AssistantListProps> = ({ 
  assistants, 
  isLoading,
  onEdit, 
  onWebhook, 
  onDelete 
}) => {
  const [searchText, setSearchText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assistantToDelete, setAssistantToDelete] = useState<Assistant | null>(null);
  const { toast } = useToast();

  const handleDelete = (assistant: Assistant) => {
    setAssistantToDelete(assistant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (assistantToDelete) {
      onDelete(assistantToDelete.assistant_id);
      toast({
        title: "Deleting assistant...",
        description: `${assistantToDelete.name} and all related webhooks are being removed.`,
      });
    }
    setDeleteDialogOpen(false);
    setAssistantToDelete(null);
  };

  const filteredAssistants = assistants.filter((assistant) =>
    assistant.name.toLowerCase().includes(searchText.toLowerCase()) ||
    assistant.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assistants..."
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button onClick={() => onEdit(null)}>
          Create New Assistant
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  <div className="flex justify-center items-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <span className="ml-2">Loading assistants...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredAssistants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  {assistants.length === 0 ? "No assistants yet. Create one to get started." : "No assistants found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredAssistants.map((assistant) => (
                <TableRow key={assistant.assistant_id}>
                  <TableCell className="font-medium">{assistant.name}</TableCell>
                  <TableCell>{assistant.description}</TableCell>
                  <TableCell>{assistant.default_model.split('/')[1]}</TableCell>
                  <TableCell>
                    <Badge variant={assistant.status === "active" ? "default" : "secondary"}>
                      {assistant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(assistant.created_at * 1000).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date((assistant.updated_at || assistant.created_at) * 1000).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(assistant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(assistant)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onWebhook(assistant)}
                      >
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assistant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{assistantToDelete?.name}"? 
              This will also delete all associated webhooks.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssistantList;
