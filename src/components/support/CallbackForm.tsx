
import React from 'react';
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CallbackFormData } from './types';

interface CallbackFormProps {
  onSubmit: (data: CallbackFormData) => void;
}

const CallbackForm = ({ onSubmit }: CallbackFormProps) => {
  const form = useForm<CallbackFormData>({
    defaultValues: {
      preferredTime: "immediately",
      phoneNumber: ""
    }
  });

  return (
    <div className="pl-8 pr-4 py-2 bg-muted/30 rounded-lg mt-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} className="text-sm" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preferredTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Preferred Time</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="immediately">As soon as possible</SelectItem>
                    <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                    <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" size="sm">Submit Request</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CallbackForm;
