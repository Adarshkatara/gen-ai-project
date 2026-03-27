import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const GlobalAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/attendance')
      .then(res => setRecords(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = records.filter(r => r.student_name.toLowerCase().includes(search.toLowerCase()) || r.course_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div>Loading Registry...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Global Attendance Registry</h2>
        <p className="text-slate-500 mb-8">Comprehensive institutional attendance oversight and deficit flagging.</p>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by student identity or course name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course Designation</th>
                <th className="px-6 py-4">Date Logged</th>
                <th className="px-6 py-4 text-right">System ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    {r.status === 'Present' 
                      ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700"><CheckCircle size={14}/> Present</span>
                      : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700"><XCircle size={14}/> Absent</span>}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{r.student_name}</td>
                  <td className="px-6 py-4">{r.course_name}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">{r.date}</span></td>
                  <td className="px-6 py-4 font-mono text-slate-400 text-xs text-right">#{r.id}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-500">No attendance footprints found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
export default GlobalAttendance;
