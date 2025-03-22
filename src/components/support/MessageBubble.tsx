
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, ChevronRight } from 'lucide-react';
import { Message } from './types';
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: Message;
  onOptionSelected: (questionId: string, questionText: string) => void;
  formatTime: (date: Date) => string;
}

const MessageBubble = ({ message, onOptionSelected, formatTime }: MessageBubbleProps) => {
  return (
    <div className="space-y-2">
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
      
      {/* Options buttons in a single column */}
      {message.isOption && message.options && message.options.length > 0 && (
        <div className="flex flex-col space-y-2 pl-8 pr-2 mt-2">
          {message.options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              size="sm"
              className="text-sm justify-between font-normal text-left px-4 py-2 h-auto"
              onClick={() => onOptionSelected(option.id, option.text)}
            >
              <span>{option.text}</span>
              <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
