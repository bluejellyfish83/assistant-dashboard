
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ModelSelector } from './assistant/ModelSelector';
import { TemperatureControl } from './assistant/TemperatureControl';
import { useToast } from "@/hooks/use-toast";
import { assistantSchema, AssistantFormValues } from '@/schemas/assistant-schema';

interface Assistant {
  assistant_id: string;
  name: string;
  description: string;
  system_prompt: string;
  default_model: string;
  default_temperature: number;
  default_max_tokens: number;
  status: string;
  created_at: number;
  last_used_at: number;
}

interface AssistantFormProps {
  assistant: Assistant | null;
  onSave: (assistant: Assistant) => void;
  onCancel: () => void;
}

const AssistantForm: React.FC<AssistantFormProps> = ({ assistant, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  // Initialize form with default values or existing assistant values
  const form = useForm<AssistantFormValues>({
    resolver: zodResolver(assistantSchema),
    defaultValues: {
      name: assistant?.name || "",
      description: assistant?.description || "",
      system_prompt: assistant?.system_prompt || "You are a helpful AI assistant.",
      default_model: assistant?.default_model || "anthropic/claude-3-haiku",
      default_temperature: assistant?.default_temperature || 0.7,
      default_max_tokens: assistant?.default_max_tokens || 1000,
    },
  });

  const onSubmit = (data: AssistantFormValues) => {
    setIsSubmitting(true);

    // Create updated assistant object
    const updatedAssistant: Assistant = {
      assistant_id: assistant?.assistant_id || `assistant-${Date.now()}`,
      name: data.name,
      description: data.description || "",
      system_prompt: data.system_prompt,
      default_model: data.default_model,
      default_temperature: data.default_temperature,
      default_max_tokens: data.default_max_tokens,
      status: "active",
      created_at: assistant?.created_at || Math.floor(Date.now() / 1000),
      last_used_at: assistant?.last_used_at || Math.floor(Date.now() / 1000),
    };

    toast({
      title: "Success",
      description: assistant
        ? "Assistant updated successfully"
        : "Assistant created successfully",
    });
    
    setIsSubmitting(false);
    onSave(updatedAssistant);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{assistant ? "Edit Assistant" : "Create New Assistant"}</CardTitle>
            <CardDescription>
              {assistant
                ? "Update the details for this assistant"
                : "Configure a new AI assistant for your needs"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid w-full gap-1.5">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Assistant name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid w-full gap-1.5">
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      placeholder="Brief description of this assistant's purpose"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="system_prompt"
              render={({ field }) => (
                <FormItem className="grid w-full gap-1.5">
                  <FormLabel htmlFor="system-prompt">System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      id="system-prompt"
                      placeholder="Instructions for the assistant's behavior and knowledge"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ModelSelector control={form.control} />
            <TemperatureControl control={form.control} />

            <FormField
              control={form.control}
              name="default_max_tokens"
              render={({ field }) => (
                <FormItem className="grid w-full gap-1.5">
                  <FormLabel htmlFor="max-tokens">Max Tokens</FormLabel>
                  <FormControl>
                    <Input
                      id="max-tokens"
                      type="number"
                      min={1}
                      max={4000}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1000)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : assistant ? "Update Assistant" : "Create Assistant"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AssistantForm;
