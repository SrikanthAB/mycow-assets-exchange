
import { Message, CallbackFormData } from '../types';
import { useOptionHandlers } from './primaryOptionHandlers';
import { useFollowUpHandlers } from './followUpHandlers';
import { useSatisfactionHandlers } from './satisfactionHandlers';
import { useCallbackHandlers } from './callbackHandlers';

export const useMessageHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setSelectedQuestion: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowConnectAgent: React.Dispatch<React.SetStateAction<boolean>>,
  setShowCallbackForm: React.Dispatch<React.SetStateAction<boolean>>,
  selectedQuestion: string | null
) => {
  // Primary option handlers
  const { handleOptionSelected } = useOptionHandlers(
    setMessages,
    setSelectedQuestion,
    setIsLoading,
    setShowConnectAgent
  );

  // Follow-up handlers
  const { handleFollowUpSelected } = useFollowUpHandlers(
    setMessages,
    setIsLoading,
    selectedQuestion
  );

  // Satisfaction and agent request handlers
  const { 
    handleSatisfactionResponse,
    handleAgentRequestResponse
  } = useSatisfactionHandlers(setMessages);

  // Callback handlers
  const {
    handleCallbackTypeSelected,
    handleCallbackSubmit
  } = useCallbackHandlers(setMessages, setShowCallbackForm);

  return {
    handleOptionSelected,
    handleFollowUpSelected,
    handleSatisfactionResponse,
    handleAgentRequestResponse,
    handleCallbackTypeSelected,
    handleCallbackSubmit
  };
};

// Re-export message creators for convenience
export { createUserMessage, createBotMessage } from './messageCreators';
