'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Loader2, Send, BookOpen, ChevronDown, Star, MessageCircle, Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTopicsStore, Topic } from '../stores/useTopicsStore';

const MessageBubble = dynamic(() => import('../components/MessageBubble'), { ssr: false });

function LearningAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ sender: 'AI', text: '👋 Hello! I\'m your AI Learning Assistant. Select some topics below and ask me anything - I\'m here to help you learn and grow!', timestamp: new Date().toLocaleTimeString() }]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [showTopics, setShowTopics] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const allTopics = useTopicsStore((state) => state.topics);

  useEffect(() => {
    if (!isLoading) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isLoading]);

  const handleToggleTopic = useCallback((topic: Topic) => {
    setSelectedTopics((prev) => {
      const exists = prev.find((t) => t.id === topic.id);
      return exists ? prev.filter((t) => t.id !== topic.id) : [...prev, topic];
    });
  }, []);

  const extractResponseText = (data: Record<string, unknown>): string => {
    const possible = ['answer', 'response', 'text', 'message', 'content', 'result'];
    for (const key of possible) {
      if (data[key] && typeof data[key] === 'string' && data[key].trim()) return data[key];
    }
    if (typeof data === 'string') return data;
    return `Debug: ${JSON.stringify(data)}`;
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    const userMessage = { sender: 'Me', text: input, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, topics: selectedTopics })
      });
      const data = await res.json();
      const responseText = extractResponseText(data);
      setMessages((prev) => [...prev, { sender: 'AI', text: responseText, timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        sender: 'AI',
        text: `⚠️ Server error: ${(err as Error).message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
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
    'What should I learn first?',
    'Explain this concept simply',
    'Give me practice exercises',
    'How does this apply in real life?'
  ];

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full h-full px-4 py-6 flex flex-col max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            AI Learning Assistant
          </h1>
          <p className="text-slate-300 text-sm">Your intelligent companion for personalized learning</p>
        </div>

        {/* Topics */}
        <div className="mb-3">
          <button
            onClick={() => setShowTopics(!showTopics)}
            className="flex items-center gap-2 text-white font-medium text-sm"
          >
            <BookOpen className="w-4 h-4" /> Personalize Learning ({selectedTopics.length})
            <ChevronDown className={`w-4 h-4 transition-transform ${showTopics ? 'rotate-180' : ''}`} />
          </button>
          {showTopics && (
            <div className="mt-2 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-md">
              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleToggleTopic(topic)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedTopics.find((t) => t.id === topic.id)
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/10 space-y-4">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              </div>
              <div className="bg-white/95 p-3 rounded-2xl shadow-lg">
                <span className="text-sm text-slate-700">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="mt-3">
            <p className="text-xs text-slate-300 mb-1">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-md"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="mt-4 flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="w-full p-3 rounded-xl bg-white text-slate-900 text-sm resize-none focus:outline-none shadow-md"
              placeholder="Ask me anything about your selected topics..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            {selectedTopics.length > 0 && (
              <div className="absolute -top-4 left-2 flex items-center gap-1 text-purple-300 text-xs">
                <Zap className="w-3 h-3" /> Personalized
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-medium disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default LearningAssistantPage;
