
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Message, CallbackFormData } from './types';
import { SUPPORT_QUESTIONS, FOLLOW_UP_OPTIONS } from './constants';

export const useChatSupport = (open: boolean, onClose: () => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showConnectAgent, setShowConnectAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize chat with welcome message and question options
  useEffect(() => {
    if (open && messages.length === 0) {
      const initialMessages: Message[] = [
        {
          sender: 'bot',
          text: 'Hello! 👋 Welcome to MyCow Support. How can I help you today?',
          timestamp: new Date(),
        },
        {
          sender: 'bot',
          text: 'Please select one of the common questions below, or type your own question:',
          timestamp: new Date(),
          isOption: true,
          options: SUPPORT_QUESTIONS
        }
      ];
      setMessages(initialMessages);
    }
  }, [open, messages.length]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleOptionSelected = async (questionId: string, questionText: string) => {
    // Add user selection as a message
    const userMessage: Message = {
      sender: 'user',
      text: questionText,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setSelectedQuestion(questionId);
    setIsLoading(true);

    try {
      // Show follow-up options
      const followUpMessage: Message = {
        sender: 'bot',
        text: 'Could you please provide more details about your issue?',
        timestamp: new Date(),
        isOption: true,
        options: FOLLOW_UP_OPTIONS[questionId as keyof typeof FOLLOW_UP_OPTIONS] || []
      };
      
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
    const userMessage: Message = {
      sender: 'user',
      text: optionText,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Call the AI support edge function with the selected question and follow-up
      const { data, error } = await supabase.functions.invoke('ai-support', {
        body: { 
          message: `${selectedQuestion}: ${optionText}`,
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
      const botResponse: Message = {
        sender: 'bot',
        text: data.reply || "I'm having trouble understanding that. Could you try rephrasing your question?",
        timestamp: new Date(),
      };
      
      // Add satisfaction question
      const satisfactionMessage: Message = {
        sender: 'bot',
        text: 'Did this answer solve your issue?',
        timestamp: new Date(),
        isOption: true,
        options: [
          { id: "satisfied", text: "Yes, this solved my issue" },
          { id: "not_satisfied", text: "No, I need more help" }
        ]
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse, satisfactionMessage]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast({
        title: "Error",
        description: "There was a problem getting a response. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback bot response
      const errorResponse: Message = {
        sender: 'bot',
        text: "I'm having some technical difficulties right now. Please try again or connect with a live agent for assistance.",
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSatisfactionResponse = (responseId: string) => {
    const userMessage: Message = {
      sender: 'user',
      text: responseId === "satisfied" ? "Yes, this solved my issue" : "No, I need more help",
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    if (responseId === "satisfied") {
      // User is satisfied
      const thankYouMessage: Message = {
        sender: 'bot',
        text: "Great! I'm glad I could help. Is there anything else you'd like to know?",
        timestamp: new Date(),
        isOption: true,
        options: SUPPORT_QUESTIONS
      };
      
      setMessages(prevMessages => [...prevMessages, thankYouMessage]);
    } else {
      // User needs more help
      const moreHelpMessage: Message = {
        sender: 'bot',
        text: "I'm sorry the answer didn't solve your issue. Would you like to speak with a human agent?",
        timestamp: new Date(),
        isOption: true,
        options: [
          { id: "connect_agent", text: "Yes, connect me with an agent" },
          { id: "try_again", text: "No, let me try asking differently" }
        ]
      };
      
      setMessages(prevMessages => [...prevMessages, moreHelpMessage]);
    }
  };

  const handleAgentRequestResponse = (responseId: string) => {
    const userMessage: Message = {
      sender: 'user',
      text: responseId === "connect_agent" ? "Yes, connect me with an agent" : "No, let me try asking differently",
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    if (responseId === "connect_agent") {
      // User wants to connect with an agent
      const agentOptions: Message = {
        sender: 'bot',
        text: "How would you like to connect with an agent?",
        timestamp: new Date(),
        isOption: true,
        options: [
          { id: "callback_now", text: "Request an immediate callback" },
          { id: "callback_scheduled", text: "Schedule a callback for later" },
          { id: "continue_chat", text: "Continue with chat support" }
        ]
      };
      
      setMessages(prevMessages => [...prevMessages, agentOptions]);
    } else {
      // User wants to try again
      const tryAgainMessage: Message = {
        sender: 'bot',
        text: "Please type your question below or select one of the common questions:",
        timestamp: new Date(),
        isOption: true,
        options: SUPPORT_QUESTIONS
      };
      
      setMessages(prevMessages => [...prevMessages, tryAgainMessage]);
    }
  };

  const handleCallbackTypeSelected = (responseId: string) => {
    const userMessage: Message = {
      sender: 'user',
      text: responseId === "callback_now" 
        ? "Request an immediate callback" 
        : responseId === "callback_scheduled" 
          ? "Schedule a callback for later"
          : "Continue with chat support",
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    if (responseId === "callback_now" || responseId === "callback_scheduled") {
      // Show callback form
      setShowCallbackForm(true);
      
      const callbackFormMessage: Message = {
        sender: 'bot',
        text: "Please provide your phone number and preferred time for a callback:",
        timestamp: new Date(),
        isCallbackRequest: true
      };
      
      setMessages(prevMessages => [...prevMessages, callbackFormMessage]);
    } else {
      // Continue with chat support
      const continueMessage: Message = {
        sender: 'bot',
        text: "I'll continue to help you through chat. What specific information do you need?",
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, continueMessage]);
    }
  };

  const handleCallbackSubmit = (data: CallbackFormData) => {
    const callbackMessage: Message = {
      sender: 'user',
      text: `Phone: ${data.phoneNumber}, Preferred time: ${data.preferredTime}`,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, callbackMessage]);
    setShowCallbackForm(false);
    
    // Confirmation message
    const confirmationMessage: Message = {
      sender: 'bot',
      text: `Thank you! An agent will call you ${data.preferredTime === "immediately" ? "as soon as possible" : "at your scheduled time"}. Your case number is #${Math.floor(10000 + Math.random() * 90000)}.`,
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, confirmationMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Show connect agent button after user sends their first message
      if (!showConnectAgent) {
        setShowConnectAgent(true);
      }

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
      const botResponse: Message = {
        sender: 'bot',
        text: data.reply || "I'm having trouble understanding that. Could you try rephrasing your question?",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      toast({
        title: "Error",
        description: "There was a problem getting a response. Please try again.",
        variant: "destructive",
      });
      
      // Add fallback bot response
      const errorResponse: Message = {
        sender: 'bot',
        text: "I'm having some technical difficulties right now. Please try again or connect with a live agent for assistance.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectAgent = () => {
    const connectMessage: Message = {
      sender: 'bot',
      text: "How would you like to connect with an agent?",
      timestamp: new Date(),
      isOption: true,
      options: [
        { id: "callback_now", text: "Request an immediate callback" },
        { id: "callback_scheduled", text: "Schedule a callback for later" },
        { id: "continue_chat", text: "Continue with chat support" }
      ]
    };
    
    setMessages((prev) => [...prev, connectMessage]);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    showConnectAgent,
    isLoading,
    showCallbackForm,
    scrollAreaRef,
    formatTime,
    handleOptionSelected,
    handleFollowUpSelected,
    handleSatisfactionResponse,
    handleAgentRequestResponse,
    handleCallbackTypeSelected,
    handleCallbackSubmit,
    handleSendMessage,
    handleConnectAgent
  };
};
