import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Search, Book } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', code: '', faculty_id: '', department_id: 1, credits: 3 });

  const fetchData = async () => {
    try {
      const [cRes, uRes] = await Promise.all([
        axios.get('/api/admin/courses'),
        axios.get('/api/admin/users')
      ]);
      setCourses(cRes.data);
      setUsers(uRes.data.filter(u => u.role === 'Faculty'));
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/courses', newCourse);
      setModalOpen(false);
      fetchData();
    } catch(err) { alert('Failed to create course'); }
  };

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div>Loading Curriculum Data...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl">
      <div className="card">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Curriculum & Course Map</h2>
          <button onClick={() => { setNewCourse({title:'', code:'', faculty_id:'', department_id:1, credits:3}); setModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={18}/> New Curriculum
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search courses by title or code..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map(c => (
            <div key={c.id} className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition bg-white group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition"><Book size={20}/></div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">{c.code}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{c.title}</h3>
              <p className="text-sm font-medium text-slate-500 mb-4">{c.dept_name || 'Computer Science'}</p>
              
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-slate-400 text-xs block">Assigned Faculty</span>
                  <span className="font-bold text-slate-700">{c.faculty_name || <span className="text-rose-500">Unassigned</span>}</span>
                </div>
                <div className="text-right text-sm">
                  <span className="text-slate-400 text-xs block">Credits</span>
                  <span className="font-bold text-slate-700">{c.credits} CR</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Define New Course</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Course Title</label>
                <input required type="text" value={newCourse.title} onChange={e=>setNewCourse({...newCourse, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Course Code</label>
                <input required type="text" value={newCourse.code} onChange={e=>setNewCourse({...newCourse, code: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assign Faculty Lead</label>
                <select required value={newCourse.faculty_id} onChange={e=>setNewCourse({...newCourse, faculty_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="" disabled>Select a Faculty Member</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4 mt-8 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default CourseManagement;
