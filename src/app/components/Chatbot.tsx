import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import { chatWithPritamoria } from '../utils/geminiAI';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatbotProps {
  isLoggedIn?: boolean;
  onRequireAuth?: () => void;
}

export function Chatbot({ isLoggedIn = true, onRequireAuth }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am Pritamoria AI, your plant care assistant. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const toggleListening = () => {
    if (!isLoggedIn) {
      setIsOpen(false);
      onRequireAuth?.();
      return;
    }

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      try {
        recognition?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Microphone start error:", e);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    if (!isLoggedIn) {
      setIsOpen(false);
      onRequireAuth?.();
      return;
    }

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const apiHistory: { role: string, parts: { text: string }[] }[] = [];
      messages.forEach((msg, index) => {
        if (index === 0) return; // Skip initial greeting
        if (msg.role === 'model' && msg.text.startsWith('Sorry, I encountered')) return; // Skip errors
        
        if (msg.role === 'user') {
          if (apiHistory.length > 0 && apiHistory[apiHistory.length - 1].role === 'user') {
             apiHistory[apiHistory.length - 1].parts[0].text += '\n' + msg.text;
          } else {
             apiHistory.push({ role: 'user', parts: [{ text: msg.text }] });
          }
        } else {
          if (apiHistory.length > 0 && apiHistory[apiHistory.length - 1].role === 'user') {
             apiHistory.push({ role: 'model', parts: [{ text: msg.text }] });
          }
        }
      });

      const response = await chatWithPritamoria(apiHistory, userMessage);

      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-black/80 backdrop-blur-md border border-green-500/30 rounded-2xl w-[320px] sm:w-[380px] shadow-[0_0_20px_rgba(34,197,94,0.3)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-500/20 p-4 border-b border-green-500/30 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-green-500/30 flex items-center justify-center bg-black">
                <img src="/pritamoria_bot_avatar.png" alt="Bot" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-green-500 font-medium">Pritamoria AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-[400px] overflow-y-auto flex flex-col space-y-4 scrollbar-thin scrollbar-thumb-green-500/30 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-green-500 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 p-3 rounded-xl rounded-bl-none flex space-x-1 items-center h-10">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-green-500/30 bg-black/40 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about plant care..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500/50"
            />
            {recognition && (
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                title={isListening ? "Listening..." : "Use voice input"}
              >
                {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isTyping}
              className="p-2 bg-green-500 rounded-full text-white hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 group overflow-hidden border-2 border-green-500/50 bg-black"
        >
          <img src="/pritamoria_bot_avatar.png" alt="Chatbot" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
