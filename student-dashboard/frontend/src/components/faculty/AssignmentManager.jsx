import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, List, Calendar } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/assignments', { course_id: courseId, title, description, due_date: dueDate });
      alert('Assignment Created');
      fetchData(); // refresh list
      setTitle(''); setDescription(''); setDueDate('');
    } catch(err) { alert('Failed to create assignment'); }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-8">
      {/* Create Assignment Form */}
      <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-black p-6 shadow-sm h-fit">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Plus className="text-primary"/> New Assignment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Course</label>
            <select value={courseId} onChange={e=>setCourseId(e.target.value)} required className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-xl p-3 text-sm">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-xl p-3 text-sm" placeholder="e.g. Midterm Essay" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} required className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-xl p-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instructions / Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} rows="4" className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-xl p-3 text-sm resize-none"></textarea>
          </div>
          <button type="submit" className="btn-faculty w-full justify-center">Publish Assignment</button>
        </form>
      </div>

      {/* Assignment List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-black dark:text-white"><List className="text-primary"/> Active Assignments</h3>
        {assignments.length > 0 ? assignments.map((a, i) => (
          <motion.div initial={{ x: 20, opacity: 0}} animate={{ x: 0, opacity: 1}} transition={{ delay: i * 0.1}} key={i} className="card hover:shadow-xl hover:-translate-y-1 transition-all border-l-4 border-l-red-500">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-md">{a.course_name}</span>
                <h4 className="text-lg font-bold text-black dark:text-white mt-2">{a.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{a.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                <Calendar size={14}/> Due {new Date(a.due_date).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        )) : <p className="text-slate-500 text-center py-10 card">No active assignments dispatched yet.</p>}
      </div>
    </motion.div>
  );
};
export default AssignmentManager;
