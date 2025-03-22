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
  
  // Extract detailed error message if available
  let errorMessage = "There was a problem getting a response. Please try again.";
  if (error instanceof Error) {
    // Log the full error details for debugging
    console.error('Error details:', error.name, error.message, error.stack);
    
    // Check for specific error types
    if (error.message.includes('Perplexity API error') || 
        error.message.includes('Authorization Required')) {
      errorMessage = "The AI service is currently unavailable. Our team has been notified.";
    } else if (error.message.includes('Failed to fetch') || 
               error.message.includes('NetworkError')) {
      errorMessage = "Network issue detected. Please check your connection and try again.";
    } else if (error.message) {
      // Use the error message but keep it reasonably short for display
      const shortMessage = error.message.split('\n')[0].substring(0, 100);
      errorMessage = `Error: ${shortMessage}${shortMessage.length >= 100 ? '...' : ''}`;
    }
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
  
  // Add fallback bot response
  const errorResponse = createBotMessage(
    "I'm having some technical difficulties right now. Please try again or connect with a live agent for assistance."
  );
  
  setMessages(prevMessages => [...prevMessages, errorResponse]);
};
