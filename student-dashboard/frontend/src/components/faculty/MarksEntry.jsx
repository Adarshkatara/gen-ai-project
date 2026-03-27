import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const MarksEntry = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examType, setExamType] = useState('Midterm');
  const [maxMarks, setMaxMarks] = useState(100);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    const init = async () => {
      try {
        const cRes = await axios.get('/api/faculty/courses');
        setCourses(cRes.data);
        if (cRes.data.length > 0) setSelectedCourse(cRes.data[0].id);
        
        const sRes = await axios.get('/api/faculty/students');
        setStudents(sRes.data);
      } catch (err) { console.error(err); }
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
      alert('Marks Secured and Published!');
      setMarks({});
    } catch (err) { alert('Failed to submit marks'); }
  };

  const relevantStudents = students.filter(s => courses.find(c => c.id == selectedCourse)?.title === s.course_name);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div className="card">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Grades Entry Engine</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-lg p-2.5">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam Configuration</label>
            <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-lg p-2.5">
              <option value="Quiz 1">Quiz 1</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final Exam</option>
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Potential Score</label>
             <input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} className="w-full bg-red-50 dark:bg-zinc-900 border-none rounded-lg p-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="px-6 py-4">Student ID#</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4 text-right">Achieved Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {relevantStudents.map(student => (
                <tr key={student.id} className="hover:bg-red-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-500">#{student.id.toString().padStart(4, '0')}</td>
                  <td className="px-6 py-4 font-bold text-red-600">{student.full_name}</td>
                  <td className="px-6 py-4 text-right">
                    <input 
                      type="number" 
                      placeholder="--"
                      value={marks[student.id] || ''}
                      onChange={e => handleMarkChange(student.id, e.target.value)}
                      className="w-24 text-center bg-white dark:bg-black border border-slate-200 dark:border-slate-600 rounded-lg p-2 font-bold text-black dark:text-white focus:ring-2 focus:ring-primary outline-none" 
                    />
                  </td>
                </tr>
              ))}
              {relevantStudents.length === 0 && <tr><td colSpan="3" className="px-6 py-8 text-center text-slate-500">No students enrolled.</td></tr>}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button onClick={submitMarks} className="btn-faculty flex items-center gap-2">
            <Save size={18} /> Publish Grades
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default MarksEntry;
