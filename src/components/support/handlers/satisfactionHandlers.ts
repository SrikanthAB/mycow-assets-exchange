
import { Message } from '../types';
import { createUserMessage, createBotMessage } from './messageCreators';
import { SUPPORT_QUESTIONS } from '../constants';

export const useSatisfactionHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const handleSatisfactionResponse = (responseId: string) => {
    const userMessage = createUserMessage(
      responseId === "satisfied" ? "Yes, this solved my issue" : "No, I need more help"
    );
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    if (responseId === "satisfied") {
      // User is satisfied
      const thankYouMessage = createBotMessage(
        "Great! I'm glad I could help. Is there anything else you'd like to know?",
        {
          isOption: true,
          options: SUPPORT_QUESTIONS
        }
      );
      
      setMessages(prevMessages => [...prevMessages, thankYouMessage]);
    } else {
      // User needs more help
      const moreHelpMessage = createBotMessage(
        "I'm sorry the answer didn't solve your issue. Would you like to speak with a human agent?",
        {
          isOption: true,
          options: [
            { id: "connect_agent", text: "Yes, connect me with an agent" },
            { id: "try_again", text: "No, let me try asking differently" }
          ]
        }
      );
      
      setMessages(prevMessages => [...prevMessages, moreHelpMessage]);
    }
  };

  const handleAgentRequestResponse = (responseId: string) => {
    const userMessage = createUserMessage(
      responseId === "connect_agent" ? "Yes, connect me with an agent" : "No, let me try asking differently"
    );
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    if (responseId === "connect_agent") {
      // User wants to connect with an agent
      const agentOptions = createBotMessage(
        "How would you like to connect with an agent?",
        {
          isOption: true,
          options: [
            { id: "callback_now", text: "Request an immediate callback" },
            { id: "callback_scheduled", text: "Schedule a callback for later" },
            { id: "continue_chat", text: "Continue with chat support" }
          ]
        }
      );
      
      setMessages(prevMessages => [...prevMessages, agentOptions]);
    } else {
      // User wants to try again
      const tryAgainMessage = createBotMessage(
        "Please type your question below or select one of the common questions:",
        {
          isOption: true,
          options: SUPPORT_QUESTIONS
        }
      );
      
      setMessages(prevMessages => [...prevMessages, tryAgainMessage]);
    }
  };

  return {
    handleSatisfactionResponse,
    handleAgentRequestResponse
  };
};
