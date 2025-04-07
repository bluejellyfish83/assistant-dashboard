
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Control } from 'react-hook-form';
import { AssistantFormValues } from '@/schemas/assistant-schema';

const models = [
  { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" },
  { value: "anthropic/claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "anthropic/claude-3-opus", label: "Claude 3 Opus" },
  { value: "openai/gpt-4o", label: "GPT-4o" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
];

interface ModelSelectorProps {
  control: Control<AssistantFormValues>;
}

export function ModelSelector({ control }: ModelSelectorProps) {
  return (
    <FormField
      control={control}
      name="default_model"
      render={({ field }) => (
        <FormItem className="grid w-full gap-1.5">
          <FormLabel htmlFor="model">Model</FormLabel>
          <Select 
            value={field.value} 
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
