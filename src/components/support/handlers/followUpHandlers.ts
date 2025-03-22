
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
      // Call the AI support edge function with the selected question and follow-up
      const { data, error } = await supabase.functions.invoke('ai-support', {
        body: { 
          message: `${selectedQuestion}: ${optionText}`,
          chatHistory: getFilteredChatHistory(await setMessages(prev => prev))
        }
      });

      if (error) {
        console.error('Error calling AI support:', error);
        throw new Error(error.message || 'Failed to get a response');
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
      handleAIError(error, setMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleFollowUpSelected
  };
};
