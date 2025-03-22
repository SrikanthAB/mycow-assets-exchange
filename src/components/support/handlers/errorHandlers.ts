
import { Message } from '../types';
import { createBotMessage } from './messageCreators';
import { toast } from "@/hooks/use-toast";

export const getFilteredChatHistory = (
  prevMessages: Message[]
): Array<{ sender: 'user' | 'bot', text: string }> => {
  return prevMessages
    .filter(msg => !msg.isOption)
    .map(msg => ({
      sender: msg.sender,
      text: msg.text
    }));
};

export const handleAIError = (
  error: any, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  console.error('Error in AI chat:', error);
  toast({
    title: "Error",
    description: "There was a problem getting a response. Please try again.",
    variant: "destructive",
  });
  
  // Add fallback bot response
  const errorResponse = createBotMessage(
    "I'm having some technical difficulties right now. Please try again or connect with a live agent for assistance."
  );
  
  setMessages(prevMessages => [...prevMessages, errorResponse]);
};
