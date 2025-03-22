
import { Message } from '../types';
import { createUserMessage, createBotMessage } from './messageCreators';
import { useToast } from "@/hooks/use-toast";
import { FOLLOW_UP_OPTIONS } from '../constants';

export const useOptionHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setSelectedQuestion: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowConnectAgent: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  const handleOptionSelected = async (questionId: string, questionText: string) => {
    // Add user selection as a message
    const userMessage = createUserMessage(questionText);
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setSelectedQuestion(questionId);
    setIsLoading(true);

    try {
      // Show follow-up options
      const followUpMessage = createBotMessage(
        'Could you please provide more details about your issue?',
        {
          isOption: true,
          options: FOLLOW_UP_OPTIONS[questionId as keyof typeof FOLLOW_UP_OPTIONS] || []
        }
      );
      
      setMessages(prevMessages => [...prevMessages, followUpMessage]);
      setShowConnectAgent(true);
    } catch (error) {
      console.error('Error in support flow:', error);
      toast({
        title: "Error",
        description: "There was a problem with the support flow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleOptionSelected
  };
};
