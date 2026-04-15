import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserCircle, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/faculty/students')
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading Directory...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl">
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2"><UserCircle className="text-primary"/> Student Directory</h2>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, idx) => (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} key={student.id} className="relative bg-white dark:bg-black border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
              
              <div className="flex items-center gap-4">
                <img src={student.profile_pic || `https://ui-avatars.com/api/?name=${student.full_name}&background=random`} alt="Profile" className="w-16 h-16 rounded-full shadow-sm border-2 border-white" />
                <div>
                  <h3 className="font-bold text-black dark:text-white text-lg">{student.full_name}</h3>
                  <p className="text-xs text-slate-500">{student.email}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md">ID: {student.id.toString().padStart(4, '0')}</span>
                </div>
                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  <Activity size={14}/> View Profile
                </button>
              </div>
            </motion.div>
          ))}
          {filteredStudents.length === 0 && <div className="col-span-full py-12 text-center text-slate-500 font-medium">No students match your search query.</div>}
        </div>
      </div>
    </motion.div>
  );
};
export default StudentDirectory;
