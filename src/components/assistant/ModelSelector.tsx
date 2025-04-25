
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
  { value: "openai/gpt-4-turbo", label: "GPT-4-turbo" },
  { value: "openai/gpt-4o", label: "GPT-4o" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "openai/gpt-4.1", label: "GPT-4.1" },
  { value: "openai/gpt-4.1-mini", label: "GPT-4.1-mini" },
  { value: "openai/gpt-4.1-nano", label: "GPT-4.1-nano" },
  { value: "anthropic/claude-3-haiku", label: "Claude 3 Haiku" },
  { value: "anthropic/claude-3-sonnet", label: "Claude 3 Sonnet" },
  { value: "liquid/lfm-7b", label: "Liquid LFM 7B" },
  { value: "deepseek/deepseek-chat-v3-0324", label: "DeepSeek V3" },
  { value: "gryphe/mythomax-l2-13b", label: "MythoMax 13B" },
  { value: "nousresearch/hermes-2-pro-llama-3-8b", label: "Hermes 2 Pro - Llama 8B" },
  { value: "google/gemma-3-27b-it", label: "Gemma 3 27B" },
  { value: "google/gemini-2.5-flash-preview", label: "Gemini 2.5 Flash Preview" },
  { value: "google/gemini-2.5-pro-preview-03-25", label: "Gemini 2.5 Pro Preview" },
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
