import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, Award, ClipboardCheck, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const MarksEntry = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examType, setExamType] = useState('Midterm');
  const [maxMarks, setMaxMarks] = useState(100);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const cRes = await axios.get('/api/faculty/courses');
        setCourses(cRes.data);
        if (cRes.data.length > 0) setSelectedCourse(cRes.data[0].id);
        
        const sRes = await axios.get('/api/faculty/students');
        setStudents(sRes.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    init();
  }, []);

  const handleMarkChange = (studentId, val) => setMarks(prev => ({ ...prev, [studentId]: val }));

  const submitMarks = async () => {
    try {
      const promises = Object.keys(marks).map(studentId => 
        axios.post('/api/faculty/marks', {
          course_id: selectedCourse,
          student_id: studentId,
          exam_type: examType,
          marks: marks[studentId],
          max_marks: maxMarks
        })
      );
      await Promise.all(promises);
      alert('Marks Secured and Published to Academic Ledger!');
      setMarks({});
    } catch (err) { alert('Failed to submit marks'); }
  };

  const relevantStudents = students.filter(s => courses.find(c => c.id == selectedCourse)?.title === s.course_name);

  if (loading) return <div className="text-slate-500 font-medium text-center py-20 flex flex-col items-center"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>Initializing Gradebook...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-3 bg-amber-500/20 rounded-xl">
             <Award className="text-amber-400" size={24} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-white tracking-tight">Gradebook Engine</h2>
             <p className="text-slate-400 text-sm mt-1">Evaluative scoring and performance documentation interface.</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-black/40 p-5 rounded-2xl border border-white/5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><ClipboardCheck size={14}/> Active Course</label>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
              {courses.map(c => <option key={c.id} value={c.id} className="bg-zinc-900">{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Settings size={14}/> Assessment Type</label>
            <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all">
              <optgroup label="Periodic" className="bg-zinc-900">
                <option value="Quiz 1">Phase 1: Quiz</option>
                <option value="Quiz 2">Phase 2: Quiz</option>
              </optgroup>
              <optgroup label="Main" className="bg-zinc-900">
                <option value="Midterm">Mid-Semester Exam</option>
                <option value="Final">Grand Finale Assessment</option>
              </optgroup>
            </select>
          </div>
          <div>
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Award size={14}/> Maximum Score</label>
             <input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-zinc-900/80 text-slate-400 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">UID Code</th>
                <th className="px-6 py-4">Student Profile</th>
                <th className="px-6 py-4 text-right pr-12">Scored Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20">
              {relevantStudents.map(student => (
                <tr key={student.id} className="hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-slate-500 group-hover:text-amber-400/60 transition-colors">#{student.id.toString().padStart(4, '0')}</td>
                  <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                    <img src={student.profile_pic || `https://ui-avatars.com/api/?name=${student.full_name}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
                    {student.full_name}
                  </td>
                  <td className="px-6 py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-3">
                      <input 
                        type="number" 
                        placeholder="00"
                        value={marks[student.id] || ''}
                        onChange={e => handleMarkChange(student.id, e.target.value)}
                        className="w-20 text-center bg-black/60 border border-white/10 rounded-xl p-2.5 font-black text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder-slate-700 hover:border-amber-500/30" 
                      />
                      <span className="text-slate-500 font-bold">/ {maxMarks}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {relevantStudents.length === 0 && (
                 <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500 font-medium"><GraduationCap className="inline-block mb-2 opacity-30" size={40}/><br/>No candidates registered for evaluation.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-end gap-4 border-t border-white/5 pt-6">
          <p className="text-xs text-slate-500 font-medium self-center mr-auto italic">* Scores are automatically weighted based on the maximum potential score.</p>
          <button className="px-6 py-3 rounded-xl border border-white/10 font-medium text-slate-300 hover:bg-white/5 transition-colors">Discard Draft</button>
          <button onClick={submitMarks} className="bg-amber-600 hover:bg-amber-500 text-white font-black py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_25px_rgba(217,119,6,0.5)] hover:-translate-y-0.5">
            <Save size={18} /> Seal & Publish Grades
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MarksEntry;
