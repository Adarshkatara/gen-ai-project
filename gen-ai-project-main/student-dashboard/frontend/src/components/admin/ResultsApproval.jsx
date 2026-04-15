import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsApproval = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/admin/results')
      .then(res => setMarks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = marks.filter(m => m.student_name.toLowerCase().includes(search.toLowerCase()) || m.course_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div>Loading Results Ledger...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Central Results Depository</h2>
        <p className="text-slate-500 mb-8">View aggregated institutional grades and process final report cards.</p>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search academic records..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition flex items-center gap-2">
            <TrendingUp size={18}/> Generate PDF Matrix
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student Context</th>
                <th className="px-6 py-4">Assessment Unit</th>
                <th className="px-6 py-4">Exam Block</th>
                <th className="px-6 py-4">Awarded Mark</th>
                <th className="px-6 py-4">Performance Vector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(m => {
                const percentage = (m.marks / m.max_marks) * 100;
                return (
                <tr key={m.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{m.student_name}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{m.course_name}</td>
                  <td className="px-6 py-4"><span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-xs font-bold">{m.exam_type}</span></td>
                  <td className="px-6 py-4 text-xl font-black text-slate-800">{m.marks}<span className="text-sm font-medium text-slate-400">/{m.max_marks}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 w-48">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${percentage >= 75 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="font-bold text-slate-600 w-10 text-right">{percentage.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              )})}
              {filtered.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-500">No grades registered yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
export default ResultsApproval;
