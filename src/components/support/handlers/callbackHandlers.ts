
import { Message, CallbackFormData } from '../types';
import { createUserMessage, createBotMessage } from './messageCreators';

export const useCallbackHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setShowCallbackForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const handleCallbackTypeSelected = (responseId: string) => {
    const userMessage = createUserMessage(
      responseId === "callback_now" 
        ? "Request an immediate callback" 
        : responseId === "callback_scheduled" 
          ? "Schedule a callback for later"
          : "Continue with chat support"
    );
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    if (responseId === "callback_now" || responseId === "callback_scheduled") {
      // Show callback form
      setShowCallbackForm(true);
      
      const callbackFormMessage = createBotMessage(
        "Please provide your phone number and preferred time for a callback:",
        { isCallbackRequest: true }
      );
      
      setMessages(prevMessages => [...prevMessages, callbackFormMessage]);
    } else {
      // Continue with chat support
      const continueMessage = createBotMessage(
        "I'll continue to help you through chat. What specific information do you need?"
      );
      
      setMessages(prevMessages => [...prevMessages, continueMessage]);
    }
  };

  const handleCallbackSubmit = (data: CallbackFormData) => {
    const callbackMessage = createUserMessage(
      `Phone: ${data.phoneNumber}, Preferred time: ${data.preferredTime}`
    );
    
    setMessages(prevMessages => [...prevMessages, callbackMessage]);
    setShowCallbackForm(false);
    
    // Confirmation message
    const confirmationMessage = createBotMessage(
      `Thank you! An agent will call you ${data.preferredTime === "immediately" ? "as soon as possible" : "at your scheduled time"}. Your case number is #${Math.floor(10000 + Math.random() * 90000)}.`
    );
    
    setMessages(prevMessages => [...prevMessages, confirmationMessage]);
  };

  return {
    handleCallbackTypeSelected,
    handleCallbackSubmit
  };
};
