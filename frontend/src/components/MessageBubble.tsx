import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import React from 'react';

const MessageBubble = React.memo(({ msg }: { msg: { sender: string, text: string, timestamp: string } }) => {
  const isMe = msg.sender === 'Me';
  return (
    <div className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
        isMe
          ? 'bg-gradient-to-br from-blue-500 to-purple-600'
          : 'bg-gradient-to-br from-purple-500 to-pink-500'
      }`}>
        {isMe ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>
      <div className={`flex-1 max-w-[85%] ${isMe ? 'text-right' : ''}`}>
        <div className={`inline-block p-3 rounded-2xl shadow-lg ${
          isMe
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm'
            : 'bg-white/95 text-slate-800 rounded-tl-sm'
        }`}>
          {msg.sender === 'AI' ? (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          )}
        </div>
        <p className={`text-xs text-slate-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
          {msg.timestamp}
        </p>
      </div>
    </div>
  );
});

export default MessageBubble;
