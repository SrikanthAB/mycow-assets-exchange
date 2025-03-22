
import { useState, useEffect, useRef } from 'react';
import { Message, CallbackFormData } from './types';
import { SUPPORT_QUESTIONS } from './constants';
import { useMessageHandlers } from './handlers/messageHandlers';
import { 
  formatTime, 
  sendMessage, 
  handleConnectAgent as connectAgent, 
  getOpenRequestMessages,
  handleViewRequestStatus
} from './handlers/messageUtils';

export const useChatSupport = (open: boolean, onClose: () => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showConnectAgent, setShowConnectAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  // Get message handlers
  const {
    handleOptionSelected,
    handleFollowUpSelected,
    handleSatisfactionResponse,
    handleAgentRequestResponse,
    handleCallbackTypeSelected,
    handleCallbackSubmit
  } = useMessageHandlers(
    setMessages, 
    setSelectedQuestion, 
    setIsLoading, 
    setShowConnectAgent, 
    setShowCallbackForm,
    selectedQuestion
  );

  // Initialize chat with open requests instead of welcome message
  useEffect(() => {
    if (open && !initialized) {
      setMessages(getOpenRequestMessages());
      setInitialized(true);
    }
    
    // Reset initialized state when chat is closed
    if (!open && initialized) {
      setInitialized(false);
    }
  }, [open, initialized]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    await sendMessage(
      inputValue,
      setMessages,
      setInputValue,
      setIsLoading,
      setShowConnectAgent,
      messages
    );
  };

  const handleConnectAgent = () => {
    connectAgent(setMessages);
  };

  // Custom handler for support request options
  const handleRequestOptionSelected = (optionId: string, optionText: string) => {
    if (optionId === 'new_request') {
      // Start a new support chat
      setMessages([
        createBotMessage("Hello! 👋 Welcome to MyCow Support. How can I help you today?"),
        createBotMessage("Please select one of the common questions below, or type your own question:", {
          isOption: true,
          options: SUPPORT_QUESTIONS
        })
      ]);
    } else if (optionId === 'view_all_requests') {
      // Show all open requests again
      setMessages(getOpenRequestMessages());
    } else if (optionId.startsWith('request_')) {
      // View a specific request status
      handleViewRequestStatus(optionId, setMessages);
    } else {
      // Handle regular options
      handleOptionSelected(optionId, optionText);
    }
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
    handleOptionSelected: handleRequestOptionSelected,
    handleFollowUpSelected,
    handleSatisfactionResponse,
    handleAgentRequestResponse,
    handleCallbackTypeSelected,
    handleCallbackSubmit,
    handleSendMessage,
    handleConnectAgent
  };
};

// Helper imports to properly type the bot message creation in this file
import { createBotMessage } from './handlers/messageUtils';
