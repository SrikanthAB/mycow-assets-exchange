
import { UseFormReturn } from "react-hook-form";

export type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isOption?: boolean;
  options?: Array<{id: string, text: string}>;
  isCallbackRequest?: boolean;
};

export type CallbackFormData = {
  preferredTime: string;
  phoneNumber: string;
};

export type SupportQuestion = {
  id: string;
  text: string;
};

export interface SupportChatbotProps {
  open: boolean;
  onClose: () => void;
}
