import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Announcements = () => {
  const [courses, setCourses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [cRes, mRes] = await Promise.all([
        axios.get('/api/faculty/courses'),
        axios.get('/api/faculty/messages')
      ]);
      setCourses(cRes.data);
      if (cRes.data.length > 0) setCourseId(cRes.data[0].id);
      setMessages(mRes.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/messages', { course_id: courseId, message });
      setMessage('');
      fetchData();
    } catch (err) { alert('Failed to send message'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-8">
      <div className="card h-fit">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Megaphone className="text-primary"/> Broadcast Announcement</h3>
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Course</label>
            <select value={courseId} onChange={e=>setCourseId(e.target.value)} required className="w-full bg-red-50 border-none rounded-xl p-3 text-sm">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message Content</label>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} required rows="5" className="w-full bg-red-50 border-none rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-red-500"></textarea>
          </div>
          <button type="submit" className="btn-faculty w-full flex items-center justify-center gap-2"><Send size={16}/> Send Broadcast</button>
        </form>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-6 text-black">Recent Announcements</h3>
        {messages.map((m, i) => (
          <motion.div initial={{ x: 20, opacity: 0}} animate={{ x: 0, opacity: 1}} transition={{ delay: i * 0.1}} key={i} className="card bg-white shadow-sm border-l-4 border-l-amber-500">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{m.course_name}</span>
              <span className="text-xs text-slate-400">{new Date(m.date).toLocaleString()}</span>
            </div>
            <p className="text-slate-700 font-medium">{m.message}</p>
          </motion.div>
        ))}
        {messages.length === 0 && <p className="text-slate-500 p-8 text-center card">No announcements sent yet.</p>}
      </div>
    </motion.div>
  );
};
export default Announcements;
