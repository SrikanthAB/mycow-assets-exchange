
import { Message } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Helper function to create a user message
export const createUserMessage = (text: string): Message => ({
  sender: 'user',
  text,
  timestamp: new Date(),
});

// Helper function to create a bot message
export const createBotMessage = (text: string, options?: { isOption?: boolean, options?: Array<{id: string, text: string}>, isCallbackRequest?: boolean }): Message => ({
  sender: 'bot',
  text,
  timestamp: new Date(),
  ...options
});

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const sendMessage = async (
  inputValue: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowConnectAgent: React.Dispatch<React.SetStateAction<boolean>>,
  messages: Message[]
) => {
  if (!inputValue.trim()) return;

  // Add user message
  const userMessage = createUserMessage(inputValue);
  
  setMessages((prev) => [...prev, userMessage]);
  setInputValue('');
  setIsLoading(true);

  try {
    // Show connect agent button after user sends their first message
    setShowConnectAgent(true);

    // Call the AI support edge function
    const { data, error } = await supabase.functions.invoke('ai-support', {
      body: { 
        message: userMessage.text,
        chatHistory: messages
          .filter(msg => !msg.isOption)
          .map(msg => ({
            sender: msg.sender,
            text: msg.text
          }))
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
    
    setMessages((prev) => [...prev, botResponse]);
  } catch (error) {
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
    
    setMessages((prev) => [...prev, errorResponse]);
  } finally {
    setIsLoading(false);
  }
};

export const handleConnectAgent = (setMessages: React.Dispatch<React.SetStateAction<Message[]>>) => {
  const connectMessage = createBotMessage(
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
  
  setMessages((prev) => [...prev, connectMessage]);
};

