
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Control } from 'react-hook-form';
import { AssistantFormValues } from '@/schemas/assistant-schema';

interface TemperatureControlProps {
  control: Control<AssistantFormValues>;
}

export function TemperatureControl({ control }: TemperatureControlProps) {
  return (
    <FormField
      control={control}
      name="default_temperature"
      render={({ field }) => (
        <FormItem className="grid w-full gap-1.5">
          <div className="flex justify-between">
            <FormLabel htmlFor="temperature">Temperature: {field.value.toFixed(1)}</FormLabel>
          </div>
          <FormControl>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[field.value]}
              onValueChange={(values) => field.onChange(values[0])}
              className="py-2"
            />
          </FormControl>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Precise</span>
            <span>Creative</span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
