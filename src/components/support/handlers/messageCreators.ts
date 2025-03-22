
import { Message } from '../types';

// Helper function to create a user message
export const createUserMessage = (text: string): Message => ({
  sender: 'user',
  text,
  timestamp: new Date(),
});

// Helper function to create a bot message
export const createBotMessage = (text: string, options?: { 
  isOption?: boolean, 
  options?: Array<{id: string, text: string}>, 
  isCallbackRequest?: boolean 
}): Message => ({
  sender: 'bot',
  text,
  timestamp: new Date(),
  ...options
});
