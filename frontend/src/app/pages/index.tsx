import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);

    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });
    const data = await res.json();

    setMessages(prev => [...prev, { sender: "bot", text: data.answer }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-4">
        <h1 className="text-2xl font-bold mb-4">AskMeBot 🤖</h1>
        <div className="space-y-2 h-96 overflow-y-scroll border rounded p-2 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`text-${msg.sender === "user" ? "right" : "left"}`}>
              <span className={`inline-block px-4 py-2 rounded-full ${msg.sender === "user" ? "bg-blue-200" : "bg-green-200"}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border rounded-l px-4 py-2"
            placeholder="Ask me anything..."
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded-r">Send</button>
        </div>
      </div>
    </div>
  );
}
