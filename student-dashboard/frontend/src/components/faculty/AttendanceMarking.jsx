import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Save } from 'lucide-react';
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
    // default all students in selected course to Present
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

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div className="card">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Mark Attendance</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full bg-red-50 dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-red-50 dark:bg-zinc-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {relevantStudents.map(student => (
                <tr key={student.id} className="hover:bg-red-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{student.full_name}</td>
                  <td className="px-6 py-4 text-xs">{student.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${attendance[student.id] === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {attendance[student.id]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleToggle(student.id)}
                      className={`p-2 rounded-lg transition-colors ${attendance[student.id] === 'Present' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {attendance[student.id] === 'Present' ? <X size={18} /> : <Check size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
              {relevantStudents.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No students found for this course.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button onClick={submitAttendance} className="btn-faculty flex items-center gap-2">
            <Save size={18} /> Submit Register
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceMarking;
