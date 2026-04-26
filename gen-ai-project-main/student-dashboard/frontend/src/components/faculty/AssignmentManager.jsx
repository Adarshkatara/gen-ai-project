import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, List, Calendar, FileText, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const AssignmentManager = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    try {
      const [cRes, aRes] = await Promise.all([
        axios.get('/api/faculty/courses'),
        axios.get('/api/faculty/assignments')
      ]);
      setCourses(cRes.data);
      if (cRes.data.length > 0) setCourseId(cRes.data[0].id);
      setAssignments(aRes.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchAiSuggestions = async () => {
    if (!courseId) return;
    setIsAiLoading(true);
    try {
      const res = await axios.post('/api/ai/generate-assignment', { course_id: courseId });
      setTitle(res.data.title);
      setDescription(res.data.description);
    } catch (e) {
      alert('Failed to fetch AI suggestions');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/assignments', { course_id: courseId, title, description, due_date: dueDate });
      alert('Assignment Created');
      fetchData(); // refresh list
      setTitle(''); setDescription(''); setDueDate('');
    } catch(err) { alert('Failed to create assignment'); }
  };

  if (loading) return <div className="text-slate-500 font-medium text-center py-20 flex flex-col items-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>Synchronizing repository...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Create Assignment Form */}
      <div className="lg:col-span-1 bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl h-fit relative overflow-hidden group hover:border-indigo-500/20 transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent z-0 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-white"><div className="p-2 bg-indigo-500/20 rounded-lg"><Plus className="text-indigo-400" size={20}/></div> Publish Mission</h3>
            <button 
              onClick={fetchAiSuggestions}
              disabled={isAiLoading}
              className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-indigo-400 transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
              title="Generate with AI"
            >
              {isAiLoading ? '...' : <><Plus size={12}/> AI Suggestions</>}
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Target Course</label>
              <select value={courseId} onChange={e=>setCourseId(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
                {courses.map(c => <option key={c.id} value={c.id} className="bg-zinc-900">{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Mission Title</label>
              <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder-slate-600" placeholder="e.g. Midterm Essay" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Deadline / Due Date</label>
              <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Instructions / Description</label>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} required rows="4" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none placeholder-slate-600" placeholder="Enter assignment guidelines here..."></textarea>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:-translate-y-0.5">
              <UploadCloud size={18}/> Dispath Assignment
            </button>
          </form>
        </div>
      </div>

      {/* Assignment List */}
      <div className="lg:col-span-2 space-y-5">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white px-2"><List className="text-indigo-400" size={20}/> Active Dispatches</h3>
        {assignments.length > 0 ? assignments.map((a, i) => (
          <motion.div initial={{ x: 20, opacity: 0}} animate={{ x: 0, opacity: 1}} transition={{ delay: i * 0.1}} key={i} className="bg-zinc-950/60 backdrop-blur-xl rounded-2xl p-5 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 group-hover:w-1.5 transition-all"></div>
            <div className="flex justify-between items-start pl-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl mt-1 border border-indigo-500/20">
                   <FileText size={20} className="text-indigo-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">{a.course_name}</span>
                  <h4 className="text-lg font-bold text-white mt-3 group-hover:text-indigo-200 transition-colors">{a.title}</h4>
                  <p className="text-sm text-slate-400 mt-1 max-w-xl">{a.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-1.5 text-[11px] font-black tracking-wider uppercase text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]">
                   <Calendar size={12}/> Due {new Date(a.due_date).toLocaleDateString()}
                 </div>
                 <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors mt-2 underline decoration-white/20 underline-offset-4">Edit Details</button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center">
            <FileText size={48} className="text-slate-600 mb-4" />
            <p className="text-slate-400 font-medium text-lg">No active assignments dispatched yet.</p>
            <p className="text-slate-500 text-sm mt-1">Use the panel on the left to create a new one.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
export default AssignmentManager;
