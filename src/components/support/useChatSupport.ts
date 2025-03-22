
import { useState, useEffect, useRef } from 'react';
import { Message, CallbackFormData } from './types';
import { SUPPORT_QUESTIONS } from './constants';
import { useMessageHandlers } from './handlers/messageHandlers';
import { formatTime, sendMessage, handleConnectAgent as connectAgent } from './handlers/messageUtils';

export const useChatSupport = (open: boolean, onClose: () => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showConnectAgent, setShowConnectAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
