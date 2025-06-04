import { useState, useRef, useEffect } from 'react';

export default function Start() {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Error: Unable to get a response." }]);
    }

    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-indigo-200 via-white to-pink-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-full flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-2xl font-bold p-6 shadow">
          AskMeBot 🤖
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow text-sm leading-relaxed transition-all duration-300 ${
                msg.sender === 'user'
                  ? 'bg-blue-100 text-gray-800 rounded-br-none'
                  : 'bg-green-100 text-gray-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="border-t bg-white p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question here..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
