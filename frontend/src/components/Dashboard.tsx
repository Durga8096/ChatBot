'use client';


import { useState } from 'react';
import Link from 'next/link';
import { useTopicsStore, Topic } from '../stores/useTopicsStore';
import { 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Play, 
  Trash2, 
  MessageCircle, 
  Brain, 
  Sparkles,
  TrendingUp,
  Target,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  const topics = useTopicsStore((state) => state.topics);
  const addTopic = useTopicsStore((state) => state.addTopic);
  const updateStatus = useTopicsStore((state) => state.updateStatus);
  const deleteTopic = useTopicsStore((state) => state.deleteTopic);

  // Calculate stats
  const completedCount = topics.filter(t => t.status === 'Completed').length;
  const inProgressCount = topics.filter(t => t.status === 'In Progress').length;
  const notStartedCount = topics.filter(t => t.status === 'Not started').length;
  const completionRate = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  const handleAdd = async () => {
    if (!title.trim()) return;

    const newTopic: Topic = {
      id: Date.now(),
      title,
      description,
      status: 'Not started',
    };

    addTopic(newTopic);
    setTitle('');
    setDescription('');
    setMessage('✅ Topic added locally');
    setMessageType('success');

    try {
      const res = await fetch('http://127.0.0.1:8000/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTopic),
      });

      if (!res.ok) throw new Error(`Backend error ${res.status}`);

      setMessage('✅ Topic synced to backend');
      setMessageType('success');
    } catch (error) {
      console.error('Error syncing topic:', error);
      setMessage('⚠️ Topic added locally, but backend sync failed');
      setMessageType('error');
    }

    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 4000);
  };

  const getStatusConfig = (status: string) => {
    if (status === 'Completed') 
      return {
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: CheckCircle2,
        color: 'text-emerald-600'
      };
    if (status === 'In Progress') 
      return {
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Play,
        color: 'text-amber-600'
      };
    return {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
      color: 'text-slate-600'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <BookOpen className="w-12 h-12 text-blue-600" />
              <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-spin" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Learning Dashboard
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Track your learning journey, manage topics, and achieve your educational goals with intelligent insights
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Topics</p>
                <p className="text-2xl font-bold text-slate-800">{topics.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-slate-800">{completedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Play className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold text-slate-800">{inProgressCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Progress Rate</p>
                <p className="text-2xl font-bold text-slate-800">{completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl shadow-lg border backdrop-blur-sm mb-8 animate-fadeInUp ${
              messageType === 'success'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-700'
                : 'bg-amber-50/80 border-amber-200 text-amber-700'
            }`}
          >
            <div className="p-2 rounded-lg bg-white/50">
              {messageType === 'success' ? 
                <CheckCircle className="w-5 h-5" /> : 
                <AlertTriangle className="w-5 h-5" />
              }
            </div>
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Add Topic Form */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Add New Learning Topic</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Topic Title</label>
              <input
                placeholder="e.g., Machine Learning Fundamentals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                placeholder="Brief description of what you want to learn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none resize-none transition-all bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                rows={3}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Topic to Learning Path
            </button>
          </div>
        </section>

        {/* Topics Grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your Learning Journey</h2>
          </div>

          {topics.length === 0 ? (
            <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No topics yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Start your learning journey by adding your first topic above. Every expert was once a beginner!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, index) => {
                const statusConfig = getStatusConfig(topic.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={topic.id} 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${statusConfig.badge.replace('text-', 'bg-').replace('bg-', 'bg-').split(' ')[0]}/20`}>
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.badge}`}>
                          {topic.status}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTopic(topic.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label={`Delete ${topic.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {topic.description || "No description provided"}
                    </p>

                    <div className="flex items-center justify-between">
                      <select
                        value={topic.status}
                        onChange={(e) => updateStatus(topic.id, e.target.value as any)}
                        className="border border-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all hover:shadow-md"
                      >
                        <option value="Not started">Not started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      
                      <div className="text-xs text-slate-400 font-medium">
                        Topic #{topic.id.toString().slice(-4)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* AI Assistant CTA */}
        <footer className="text-center pt-16 pb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Ready to Learn?</h3>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get personalized guidance and answers to your questions with our AI Learning Assistant. 
              Start meaningful conversations about your topics and accelerate your learning journey.
            </p>
            <Link
              href="/learning_assistant"
              className="inline-flex items-center gap-3 bg-white text-blue-600 font-semibold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Launch AI Learning Assistant
            </Link>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}