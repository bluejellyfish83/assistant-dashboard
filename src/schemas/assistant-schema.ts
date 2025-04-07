
import { z } from "zod";

export const assistantSchema = z.object({
  name: z.string().min(1, "Assistant name is required"),
  description: z.string().optional(),
  system_prompt: z.string().default("You are a helpful AI assistant."),
  default_model: z.string().default("anthropic/claude-3-haiku"),
  default_temperature: z.number().min(0).max(1).default(0.7),
  default_max_tokens: z.number().min(1).max(4000).default(1000),
});

export type AssistantFormValues = z.infer<typeof assistantSchema>;
