import { Message, SupportRequest } from '../types';
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

// Mock data for open support requests
// In a real app, this would come from your database
export const getMockSupportRequests = (): SupportRequest[] => [
  {
    id: '1001',
    status: 'open',
    type: 'Callback Request',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: '1002',
    status: 'in-progress',
    type: 'Technical Issue',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  }
];

export const getOpenRequestMessages = (): Message[] => {
  const requests = getMockSupportRequests();
  
  if (requests.length === 0) {
    return [
      createBotMessage("You don't have any open support requests. How can I help you today?"),
      createBotMessage("Please select one of the common questions below, or type your own question:", {
        isOption: true,
        options: [
          { id: "account", text: "Account issues" },
          { id: "payments", text: "Payment questions" },
          { id: "technical", text: "Technical support" },
          { id: "other", text: "Other inquiries" }
        ]
      })
    ];
  }
  
  const messages: Message[] = [
    createBotMessage("You have the following open support requests:"),
  ];
  
  // Add each request as an option
  messages.push(
    createBotMessage("Select a request to view its status:", {
      isOption: true,
      options: requests.map(req => ({
        id: `request_${req.id}`,
        text: `#${req.id}: ${req.type} (${req.status})`
      })).concat([{ id: "new_request", text: "Start a new support request" }])
    })
  );
  
  return messages;
};

export const handleViewRequestStatus = (
  requestId: string, 
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  const requests = getMockSupportRequests();
  const request = requests.find(req => req.id === requestId.replace('request_', ''));
  
  if (!request) {
    setMessages(prev => [
      ...prev,
      createUserMessage(`View request #${requestId.replace('request_', '')}`),
      createBotMessage("Sorry, I couldn't find that request. Please try another option.")
    ]);
    return;
  }
  
  // Add user message indicating they selected this request
  setMessages(prev => [
    ...prev,
    createUserMessage(`View request #${request.id}`)
  ]);
  
  // Create status message based on request status
  let statusMessage = "";
  let nextStepsMessage = "";
  
  switch (request.status) {
    case 'open':
      statusMessage = `Your request #${request.id} for "${request.type}" is currently open and awaiting review by our support team.`;
      nextStepsMessage = "Our team will contact you within 24 hours.";
      break;
    case 'in-progress':
      statusMessage = `Your request #${request.id} for "${request.type}" is currently being worked on by our support team.`;
      nextStepsMessage = "A support agent has been assigned and is investigating your issue.";
      break;
    case 'resolved':
      statusMessage = `Your request #${request.id} for "${request.type}" has been resolved.`;
      nextStepsMessage = "If you're still experiencing issues, please let us know and we'll reopen your case.";
      break;
  }
  
  // Add bot response with request details
  setMessages(prev => [
    ...prev,
    createBotMessage(statusMessage),
    createBotMessage(`${nextStepsMessage} Would you like to do something else?`, {
      isOption: true,
      options: [
        { id: "view_all_requests", text: "View all open requests" },
        { id: "new_request", text: "Start a new support request" }
      ]
    })
  ]);
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
