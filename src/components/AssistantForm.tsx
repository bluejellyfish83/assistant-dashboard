
import React from 'react';
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const models = [
  { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" },
  { value: "anthropic/claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "anthropic/claude-3-opus", label: "Claude 3 Opus" },
  { value: "openai/gpt-4o", label: "GPT-4o" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
];

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
  onSave: () => void;
  onCancel: () => void;
}

const AssistantForm: React.FC<AssistantFormProps> = ({ assistant, onSave, onCancel }) => {
  const [name, setName] = React.useState(assistant?.name || "");
  const [description, setDescription] = React.useState(assistant?.description || "");
  const [systemPrompt, setSystemPrompt] = React.useState(
    assistant?.system_prompt || "You are a helpful AI assistant."
  );
  const [model, setModel] = React.useState(assistant?.default_model || "anthropic/claude-3-haiku");
  const [temperature, setTemperature] = React.useState(assistant?.default_temperature || 0.7);
  const [maxTokens, setMaxTokens] = React.useState(assistant?.default_max_tokens || 1000);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Assistant name is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: assistant
          ? "Assistant updated successfully"
          : "Assistant created successfully",
      });
      setIsSubmitting(false);
      onSave();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <div className="grid w-full gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Assistant name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of this assistant's purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="Instructions for the assistant's behavior and knowledge"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full gap-1.5">
            <div className="flex justify-between">
              <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={(values) => setTemperature(values[0])}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              min={1}
              max={4000}
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1000)}
            />
          </div>
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
  );
};

export default AssistantForm;
