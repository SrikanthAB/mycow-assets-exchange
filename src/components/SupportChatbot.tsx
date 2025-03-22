
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  Phone, 
  Loader2, 
} from 'lucide-react';
import { useChatSupport } from './support/useChatSupport';
import MessageBubble from './support/MessageBubble';
import CallbackForm from './support/CallbackForm';
import { SupportChatbotProps } from './support/types';

const SupportChatbot = ({ open, onClose }: SupportChatbotProps) => {
  const {
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
  } = useChatSupport(open, onClose);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMessageOptionClick = (questionId: string, questionText: string) => {
    // Determine which handler to use based on option context
    const satisfactionOptions = ["satisfied", "not_satisfied"];
    const agentRequestOptions = ["connect_agent", "try_again"];
    const callbackTypeOptions = ["callback_now", "callback_scheduled", "continue_chat"];
    
    // Check if the option is in one of the special categories
    if (satisfactionOptions.includes(questionId)) {
      handleSatisfactionResponse(questionId);
    } else if (agentRequestOptions.includes(questionId)) {
      handleAgentRequestResponse(questionId);
    } else if (callbackTypeOptions.includes(questionId)) {
      handleCallbackTypeSelected(questionId);
    } else {
      // Check for follow-up option
      const isFollowUpOption = Object.values(FOLLOW_UP_OPTIONS).some(
        options => options.some(option => option.id === questionId)
      );
      
      if (isFollowUpOption) {
        handleFollowUpSelected(questionId, questionText);
      } else {
        // Default to primary question
        handleOptionSelected(questionId, questionText);
      }
    }
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
              <div key={index}>
                {/* Regular message bubble */}
                <MessageBubble 
                  message={message} 
                  onOptionSelected={handleMessageOptionClick}
                  formatTime={formatTime}
                />
                
                {/* Callback request form */}
                {message.isCallbackRequest && showCallbackForm && (
                  <CallbackForm onSubmit={handleCallbackSubmit} />
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

// Add missing import for FOLLOW_UP_OPTIONS
import { FOLLOW_UP_OPTIONS } from './support/constants';

export default SupportChatbot;
