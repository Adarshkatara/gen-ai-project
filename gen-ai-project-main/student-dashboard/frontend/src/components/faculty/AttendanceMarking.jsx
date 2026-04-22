import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Save, Calendar, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const AttendanceMarking = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const cRes = await axios.get('/api/faculty/courses');
        setCourses(cRes.data);
        if (cRes.data.length > 0) setSelectedCourse(cRes.data[0].id);
        
        const sRes = await axios.get('/api/faculty/students');
        setStudents(sRes.data);
      } catch (err) {
        console.error("Failed to load attendance data", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleToggle = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  useEffect(() => {
    const relevantStudents = students.filter(s => courses.find(c => c.id == selectedCourse)?.title === s.course_name);
    const initial = {};
    relevantStudents.forEach(s => initial[s.id] = 'Present');
    setAttendance(initial);
  }, [selectedCourse, students, courses]);

  const submitAttendance = async () => {
    try {
      const promises = Object.keys(attendance).map(studentId => 
        axios.post('/api/faculty/attendance', {
          course_id: selectedCourse,
          student_id: studentId,
          date,
          status: attendance[studentId]
        })
      );
      await Promise.all(promises);
      alert('Attendance Submitted Successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to submit attendance');
    }
  };

  const relevantStudents = students.filter(s => courses.find(c => c.id == selectedCourse)?.title === s.course_name);

  if (loading) return <div className="text-slate-500 font-medium text-center py-20 flex flex-col items-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>Fetching class roster...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-emerald-500/20 rounded-xl">
             <Check className="text-emerald-400" size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-white tracking-tight">Mark Attendance</h2>
             <p className="text-slate-400 text-sm mt-1">Digitally sign class presence and auto-sync with the central ledger.</p>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mb-8 bg-black/40 p-5 rounded-2xl border border-white/5">
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><BookOpen size={14}/> Select Course</label>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Calendar size={14}/> Date of Session</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-zinc-900/80 text-slate-400 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-center">Current Status</th>
                <th className="px-6 py-4 text-center">Toggle Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20">
              {relevantStudents.map(student => (
                <tr key={student.id} className="hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <img src={student.profile_pic || `https://ui-avatars.com/api/?name=${student.full_name}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
                    {student.full_name}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">{student.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase font-black tracking-wider ${attendance[student.id] === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'}`}>
                      {attendance[student.id]}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <button 
                      onClick={() => handleToggle(student.id)}
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${attendance[student.id] === 'Present' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20'}`}
                    >
                      {attendance[student.id] === 'Present' ? <X size={18} /> : <Check size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
              {relevantStudents.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium"><Users className="inline-block mb-2 opacity-50" size={32}/><br/>No students enrolled in this course yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-end gap-4 border-t border-white/5 pt-6">
          <button className="px-6 py-3 rounded-xl border border-white/10 font-medium text-slate-300 hover:bg-white/5 transition-colors">Reset All</button>
          <button onClick={submitAttendance} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:-translate-y-0.5">
            <Save size={18} /> Publish to Ledger
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceMarking;
