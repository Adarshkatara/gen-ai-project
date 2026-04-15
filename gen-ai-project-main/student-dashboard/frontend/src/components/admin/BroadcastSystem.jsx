import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Globe, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const BroadcastSystem = () => {
  const [messages, setMessages] = useState([]);
  const [audience, setAudience] = useState('All');
  const [content, setContent] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/announcements');
      setMessages(res.data);
    } catch(e) { console.error(e); }
  };
  useEffect(() => { fetchMessages(); }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/announcements', { target_audience: audience, message: content });
      setContent('');
      fetchMessages();
    } catch(err) { alert('Failed to broadcast via API.'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
      <div className="card space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Global Mass Broadcast</h2>
          <p className="text-slate-500 mt-1">Publish emergency notifications or wide-state announcements natively to all linked account portals.</p>
        </div>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Target Node Audience</label>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={()=>setAudience('All')} className={`py-3 rounded-xl font-bold text-sm border-2 transition ${audience==='All'?'border-blue-600 bg-blue-50 text-blue-700':'border-slate-100 text-slate-500'}`}>
                <Globe className="mx-auto mb-1" size={18}/> Global
              </button>
              <button type="button" onClick={()=>setAudience('Students')} className={`py-3 rounded-xl font-bold text-sm border-2 transition ${audience==='Students'?'border-emerald-600 bg-emerald-50 text-emerald-700':'border-slate-100 text-slate-500'}`}>
                <Users className="mx-auto mb-1" size={18}/> Students
              </button>
              <button type="button" onClick={()=>setAudience('Faculty')} className={`py-3 rounded-xl font-bold text-sm border-2 transition ${audience==='Faculty'?'border-rose-600 bg-rose-50 text-rose-700':'border-slate-100 text-slate-500'}`}>
                <BookOpen className="mx-auto mb-1" size={18}/> Faculty
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Message Payload</label>
            <textarea required rows="4" value={content} onChange={e=>setContent(e.target.value)} placeholder="Type announcement here..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-lg flex justify-center items-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
            <Send size={20}/> Publish Broadcast
          </button>
        </form>
      </div>

      <div className="card overflow-y-auto max-h-[600px] custom-scrollbar">
        <h3 className="font-bold text-slate-800 text-lg mb-6 sticky top-0 bg-white pb-3 border-b border-slate-100">Broadcast History</h3>
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${m.target_audience==='All'?'bg-blue-200 text-blue-800':m.target_audience==='Students'?'bg-emerald-200 text-emerald-800':'bg-rose-200 text-rose-800'}`}>
                  To: {m.target_audience}
                </span>
                <span className="text-xs text-slate-400 font-medium">{m.date}</span>
              </div>
              <p className="text-sm font-medium text-slate-700">{m.message}</p>
              <p className="text-xs font-bold text-slate-400 mt-3 pt-3 border-t border-slate-200">Authorized by: {m.sender_name}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default BroadcastSystem;
