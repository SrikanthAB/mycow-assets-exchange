
import { Message } from '../types';
import { createUserMessage, createBotMessage } from './messageCreators';
import { supabase } from "@/integrations/supabase/client";
import { handleAIError, getFilteredChatHistory } from './errorHandlers';

export const useFollowUpHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  selectedQuestion: string | null
) => {
  const handleFollowUpSelected = async (optionId: string, optionText: string) => {
    // Add user selection as a message
    const userMessage = createUserMessage(optionText);
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // First, get the current messages
      let currentMessages: Message[] = [];
      setMessages(prev => {
        currentMessages = prev;
        return prev;
      });

      // Call the AI support edge function with the selected question and follow-up
      const { data, error } = await supabase.functions.invoke('ai-support', {
        body: { 
          message: `${selectedQuestion}: ${optionText}`,
          chatHistory: getFilteredChatHistory(currentMessages)
        }
      });

      if (error) {
        console.error('Error calling AI support:', error);
        throw new Error(`Failed to get a response: ${error.message || 'Unknown error'}`);
      }

      if (!data || !data.reply) {
        console.error('Invalid response format from AI support:', data);
        throw new Error('Received an invalid response format from the support service');
      }

      // Add AI response
      const botResponse = createBotMessage(
        data.reply || "I'm having trouble understanding that. Could you try rephrasing your question?"
      );
      
      // Add satisfaction question
      const satisfactionMessage = createBotMessage(
        'Did this answer solve your issue?',
        {
          isOption: true,
          options: [
            { id: "satisfied", text: "Yes, this solved my issue" },
            { id: "not_satisfied", text: "No, I need more help" }
          ]
        }
      );
      
      setMessages(prevMessages => [...prevMessages, botResponse, satisfactionMessage]);
    } catch (error) {
      // Pass the full error object with detailed information
      handleAIError(error, setMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleFollowUpSelected
  };
};
