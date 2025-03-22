
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
import { 
  Send, 
  Bot, 
  User, 
  Phone, 
  Loader2, 
  MessageSquare,
  ArrowDown
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Pre-defined support question options
const SUPPORT_QUESTIONS = [
  { id: "login", text: "I'm having trouble logging in" },
  { id: "deposit", text: "How do I deposit funds?" },
  { id: "withdraw", text: "I need help with a withdrawal" },
  { id: "investment", text: "Questions about investment options" },
  { id: "returns", text: "Understanding my returns and performance" }
];

// Follow-up options based on initial question
const FOLLOW_UP_OPTIONS = {
  login: [
    { id: "forgot_password", text: "I forgot my password" },
    { id: "account_locked", text: "My account is locked" },
    { id: "verification", text: "I can't complete verification" }
  ],
  deposit: [
    { id: "deposit_methods", text: "What deposit methods are available?" },
    { id: "deposit_limit", text: "What are the deposit limits?" },
    { id: "processing_time", text: "How long do deposits take to process?" }
  ],
  withdraw: [
    { id: "withdrawal_methods", text: "What withdrawal methods are available?" },
    { id: "withdrawal_limit", text: "What are the withdrawal limits?" },
    { id: "withdrawal_time", text: "How long do withdrawals take to process?" }
  ],
  investment: [
    { id: "investment_options", text: "What investment options are available?" },
    { id: "min_investment", text: "What's the minimum investment amount?" },
    { id: "risk_levels", text: "How are risk levels determined?" }
  ],
  returns: [
    { id: "performance_calc", text: "How is performance calculated?" },
    { id: "tax_reporting", text: "How does tax reporting work?" },
    { id: "expected_returns", text: "What returns can I expect?" }
  ]
};

type CallbackFormData = {
  preferredTime: string;
  phoneNumber: string;
};

type Message = {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isOption?: boolean;
  options?: Array<{id: string, text: string}>;
  isCallbackRequest?: boolean;
};

interface SupportChatbotProps {
  open: boolean;
  onClose: () => void;
}

const SupportChatbot = ({ open, onClose }: SupportChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showConnectAgent, setShowConnectAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const form = useForm<CallbackFormData>({
    defaultValues: {
      preferredTime: "immediately",
      phoneNumber: ""
    }
  });

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
              <div key={index} className="space-y-2">
                <div 
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
                
                {/* Options buttons */}
                {message.isOption && message.options && message.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-8">
                    {message.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          if (message.options?.find(o => o.id === "satisfied" || o.id === "not_satisfied")) {
                            handleSatisfactionResponse(option.id);
                          } else if (message.options?.find(o => o.id === "connect_agent" || o.id === "try_again")) {
                            handleAgentRequestResponse(option.id);
                          } else if (message.options?.find(o => o.id === "callback_now" || o.id === "callback_scheduled" || o.id === "continue_chat")) {
                            handleCallbackTypeSelected(option.id);
                          } else if (FOLLOW_UP_OPTIONS[selectedQuestion as keyof typeof FOLLOW_UP_OPTIONS]?.find(o => o.id === option.id)) {
                            handleFollowUpSelected(option.id, option.text);
                          } else {
                            handleOptionSelected(option.id, option.text);
                          }
                        }}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Callback request form */}
                {message.isCallbackRequest && showCallbackForm && (
                  <div className="pl-8 pr-4 py-2 bg-muted/30 rounded-lg mt-2">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleCallbackSubmit)} className="space-y-3">
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1 (555) 123-4567" {...field} className="text-sm" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="preferredTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Preferred Time</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="immediately">As soon as possible</SelectItem>
                                  <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
                                  <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                                  <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" size="sm">Submit Request</Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
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
        
        {showConnectAgent && !showCallbackForm && (
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
            disabled={isLoading || showCallbackForm}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={isLoading || showCallbackForm}>
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
