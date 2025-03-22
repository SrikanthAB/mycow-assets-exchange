
import { Message, CallbackFormData } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SUPPORT_QUESTIONS, FOLLOW_UP_OPTIONS } from '../constants';

// Helper function to create a user message
const createUserMessage = (text: string): Message => ({
  sender: 'user',
  text,
  timestamp: new Date(),
});

// Helper function to create a bot message
const createBotMessage = (text: string, options?: { isOption?: boolean, options?: Array<{id: string, text: string}>, isCallbackRequest?: boolean }): Message => ({
  sender: 'bot',
  text,
  timestamp: new Date(),
  ...options
});

export const useMessageHandlers = (
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setSelectedQuestion: React.Dispatch<React.SetStateAction<string | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowConnectAgent: React.Dispatch<React.SetStateAction<boolean>>,
  setShowCallbackForm: React.Dispatch<React.SetStateAction<boolean>>,
  selectedQuestion: string | null
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
          chatHistory: getFilteredChatHistory(setMessages)
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
      handleAIError(error, setMessages, toast);
    } finally {
      setIsLoading(false);
    }
  };

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
    handleOptionSelected,
    handleFollowUpSelected,
    handleSatisfactionResponse,
    handleAgentRequestResponse,
    handleCallbackTypeSelected,
    handleCallbackSubmit
  };
};

// Helper functions
const getFilteredChatHistory = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  return (
    (prevMessages: Message[]) => 
      prevMessages
        .filter(msg => !msg.isOption)
        .map(msg => ({
          sender: msg.sender,
          text: msg.text
        }))
  );
};

const handleAIError = (
  error: any, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  toast: ReturnType<typeof useToast>["toast"]
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

