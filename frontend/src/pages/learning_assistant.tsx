'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Loader2, Send, Bot, User, Sparkles, Brain, BookOpen,
  Star, ChevronDown, MessageCircle, Zap
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTopicsStore, Topic } from '../stores/useTopicsStore';

function LearningAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [showTopics, setShowTopics] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const allTopics = useTopicsStore((state) => state.topics);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        sender: 'AI',
        text: '👋 Hello! I\'m your AI Learning Assistant. Select some topics below and ask me anything - I\'m here to help you learn and grow!',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  }, []);

  const handleToggleTopic = (topic: Topic) => {
    const exists = selectedTopics.find((t) => t.id === topic.id);
    if (exists) {
      setSelectedTopics((prev) => prev.filter((t) => t.id !== topic.id));
    } else {
      setSelectedTopics((prev) => [...prev, topic]);
    }
  };

  const extractResponseText = (data: Record<string, unknown>): string => {
    const possibleProperties = ['answer', 'response', 'text', 'message', 'content', 'result'];
    for (const prop of possibleProperties) {
      if (data[prop] && typeof data[prop] === 'string' && (data[prop] as string).trim()) {
        return data[prop] as string;
      }
    }
    if (typeof data === 'string' && data.trim()) return data;
    return `Debug: ${JSON.stringify(data)}`;
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);

    const userMessage = {
      sender: 'Me',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          topics: selectedTopics,
        }),
      });

      if (!response.ok) throw new Error(`API request failed with status: ${response.status}`);

      const data = await response.json();
      const responseText = extractResponseText(data);

      const aiMessage = {
        sender: 'AI',
        text: responseText || '⚠️ AI returned an empty response.',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: `⚠️ Failed to get a response from the server. Error: ${(error as Error).message}`,
          timestamp: new Date().toLocaleTimeString()
        },
      ]);
    } finally {
      setInput('');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const suggestedQuestions = [
    "What should I learn first?",
    "Explain this concept simply",
    "Give me practice exercises",
    "How does this apply in real life?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-2 flex flex-col h-screen">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="relative">
              <Brain className="w-8 h-8 text-purple-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              AI Learning Assistant
            </h1>
          </div>
          <p className="text-slate-300 text-xs">Your intelligent companion for personalized learning</p>
        </div>

        {/* Topics */}
        <div className="mb-2">
          <button
            onClick={() => setShowTopics(!showTopics)}
            className="flex items-center gap-2 text-white font-medium mb-2 hover:text-purple-300 transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Personalize Learning ({selectedTopics.length} selected)
            <ChevronDown className={`w-4 h-4 transition-transform ${showTopics ? 'rotate-180' : ''}`} />
          </button>
          {showTopics && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleToggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedTopics.find((t) => t.id === topic.id)
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
              {selectedTopics.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-emerald-300">
                  <Star className="w-3 h-3" />
                  <p className="text-xs font-medium">
                    {selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''} selected for personalization
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-white font-medium text-sm">AI Assistant Online</span>
              <MessageCircle className="w-4 h-4 text-purple-300 ml-auto" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent min-h-0">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 animate-fadeInUp ${
                  msg.sender === 'Me' ? 'flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  msg.sender === 'Me'
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {msg.sender === 'Me' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`flex-1 max-w-[85%] ${msg.sender === 'Me' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-2xl shadow-lg ${
                    msg.sender === 'Me'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm'
                      : 'bg-white/95 text-slate-800 rounded-tl-sm backdrop-blur-sm'
                  }`}>
                    {msg.sender === 'AI' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-slate-700 prose-strong:text-slate-700 prose-code:text-slate-600 prose-pre:bg-slate-100">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                  <p className={`text-xs text-slate-400 mt-1 ${msg.sender === 'Me' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 animate-fadeInUp">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/95 p-3 rounded-2xl rounded-tl-sm shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex-shrink-0">
              <p className="text-slate-300 text-xs mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-slate-300 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/10"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-white/5 flex-shrink-0">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  className="w-full px-4 py-3 bg-white/95 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800 placeholder-slate-500 resize-none backdrop-blur-sm border border-white/20 shadow-lg text-sm"
                  placeholder="Ask me anything about your selected topics..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                {selectedTopics.length > 0 && (
                  <div className="absolute -top-4 left-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-300">Personalized</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className="px-5 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center gap-2 font-medium text-sm"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-purple-500\\/20::-webkit-scrollbar-thumb {
          background-color: rgba(168, 85, 247, 0.2);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default LearningAssistantPage;
