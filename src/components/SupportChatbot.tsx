
import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Phone, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

interface SupportChatbotProps {
  open: boolean;
  onClose: () => void;
}

const SupportChatbot = ({ open, onClose }: SupportChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! 👋 Welcome to MyCow Support. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showConnectAgent, setShowConnectAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
          chatHistory: messages.map(msg => ({
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleConnectAgent = () => {
    const connectMessage: Message = {
      sender: 'bot',
      text: "Thank you for requesting agent support. An agent will connect with you shortly. Your case number is #" + Math.floor(10000 + Math.random() * 90000),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, connectMessage]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[500px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/lovable-uploads/2357ba2d-c9c0-46f4-8848-6384dd15da4b.png" />
              <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>MyCow Support</DialogTitle>
              <DialogDescription className="text-xs">AI-powered assistance</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`flex items-start max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  } rounded-lg px-3 py-2`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-6 w-6 mr-2 mt-0.5">
                      <AvatarImage src="/lovable-uploads/2357ba2d-c9c0-46f4-8848-6384dd15da4b.png" />
                      <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                    <div className="text-[10px] mt-1 opacity-70 text-right">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-6 w-6 ml-2 mt-0.5">
                      <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center bg-muted rounded-lg px-3 py-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="/lovable-uploads/2357ba2d-c9c0-46f4-8848-6384dd15da4b.png" />
                    <AvatarFallback><Bot className="h-3 w-3" /></AvatarFallback>
                  </Avatar>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {showConnectAgent && (
          <div className="px-4 py-2 border-t border-b bg-muted/50">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center" 
              onClick={handleConnectAgent}
            >
              <Phone className="h-3 w-3 mr-2" />
              Connect with an Agent
            </Button>
          </div>
        )}
        
        <div className="p-4 border-t flex gap-2">
          <Input 
            placeholder="Type your message..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isLoading}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportChatbot;
