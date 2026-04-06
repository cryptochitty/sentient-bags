import React, { useState, useEffect } from 'react';
import { Brain, Wallet, TrendingUp, Send, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [status, setStatus] = useState<any>(null);
  const [chat, setChat] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/agent/status')
      .then(res => res.json())
      .then(data => setStatus(data));
  }, []);

  const handleSend = async () => {
    if (!input) return;
    setLoading(true);
    const userMsg = { role: 'user', content: input };
    setChat([...chat, userMsg]);
    setInput('');

    const res = await fetch('/api/agent/interact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();
    setChat(prev => [...prev, { role: 'aura', content: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse">
            <Brain size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter">AURA <span className="text-cyan-500 underline">SENTIENT</span></h1>
        </div>
        <div className="flex gap-4 items-center bg-slate-900/50 p-2 rounded-xl border border-slate-800">
          <Wallet className="text-cyan-500" size={20} />
          <span className="font-mono">{status?.balance || '0.00 SOL'}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Zap size={16} /> Autonomous Status
            </h2>
            <p className="text-xl font-medium">{status?.status}</p>
            <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="h-full bg-cyan-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <TrendingUp size={16} /> Recent Activity
            </h2>
            {status?.recentTrades.map((trade: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg mb-2">
                <span className="text-green-400 font-bold">{trade.type}</span>
                <span className="font-mono">{trade.token}</span>
                <span className="text-slate-400">{trade.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: The Brain Terminal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-cyan-500" />
                <span className="font-semibold">Neural Interface</span>
              </div>
              <span className="text-xs text-slate-500">Claude 3.5 Sonnet Connected</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl">
                <p className="text-cyan-400 text-sm italic">"Initializing search via Genspark... Analyzing Four.Meme trends... Protocol active."</p>
              </div>
              <AnimatePresence>
                {chat.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-xl ${
                      m.role === 'user' ? 'bg-cyan-600' : 'bg-slate-800'
                    }`}>
                      {m.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && <div className="text-slate-500 text-sm animate-pulse">AURA is thinking...</div>}
            </div>

            <div className="p-4 border-t border-slate-800 flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Influence the agent..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                className="bg-cyan-500 hover:bg-cyan-400 p-2 rounded-xl transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;