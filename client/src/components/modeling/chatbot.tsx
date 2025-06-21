import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Bot, User, X, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Hi! I'm your AI assistant. I can help you design better data models, suggest relationships, and generate optimized code. What would you like to work on?",
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      setIsOpen(event.detail.show);
    };

    window.addEventListener('toggleChatbot', handleToggle as EventListener);
    return () => window.removeEventListener('toggleChatbot', handleToggle as EventListener);
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: (message: string) => 
      apiRequest("POST", "/api/chat", { message }).then(res => res.json()),
    onSuccess: (response) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        message: response.message,
        isUser: false,
        timestamp: response.timestamp,
      };
      setMessages(prev => [...prev, aiMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-surface rounded-xl shadow-2xl border border-gray-200 z-50">
      <div className="bg-gradient-to-r from-accent to-orange-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot size={20} />
            <span className="font-semibold">AI Data Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white p-1"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 ${message.isUser ? "justify-end" : ""}`}
          >
            {!message.isUser && (
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white" size={12} />
              </div>
            )}
            <div
              className={`rounded-lg p-3 text-sm max-w-xs ${
                message.isUser
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.message}
            </div>
            {message.isUser && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-white" size={12} />
              </div>
            )}
          </div>
        ))}
        {sendMessageMutation.isPending && (
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white" size={12} />
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your data model..."
            className="flex-1 text-sm"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
            className="bg-accent hover:bg-orange-600"
          >
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
