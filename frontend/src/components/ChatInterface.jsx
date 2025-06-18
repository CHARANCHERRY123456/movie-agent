import React, { useState, useRef, useEffect } from 'react';
import { Send, Database, AlertCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import LoadingSpinner from './LoadingSpinner';
import ChartVisualization from './ChartVisualization';
import { chatApi } from '../api/chatApi';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I can help you query the movies database using natural language. Try asking me something like "List all Telugu movies after 2020" or "Show average rating per genre".',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(userMessage.content);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message || 'Query executed successfully',
        timestamp: new Date(),
        data: response.data,
        sql: response.generatedSQL,
        queryType: response.queryType,
        visualization: response.visualization,
        rowCount: response.rowCount
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setError(error.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const exampleQueries = [
    "List all Telugu movies after 2020",
    "Show average rating per genre",
    "Insert a new movie: Pushpa 2, 2024, Action, Rating 8.0",
    "Find movies with rating above 8.0",
    "Count movies by language"
  ];

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-t-lg shadow-sm">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-primary-500" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Movies Database Chat
            </h1>
            <p className="text-sm text-gray-500">
              Ask questions in natural language
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Powered by LangChain + Gemini
        </div>
      </div>

      {/* Example queries */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(query)}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div key={message.id} className="animate-slide-up">
            <MessageBubble message={message} />
            {message.visualization && message.data && (
              <ChartVisualization 
                data={message.data}
                config={message.visualization}
              />
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="message-bubble bot-message flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-600">Processing your query...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="input-container">
        <textarea
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about the movies database..."
          className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows="1"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;