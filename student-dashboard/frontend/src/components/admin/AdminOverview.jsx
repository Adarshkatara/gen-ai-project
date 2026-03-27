import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, BookOpen, UserCheck, DollarSign, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/analytics').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="text-slate-500 min-h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full border-4 border-t-blue-600 border-slate-200 h-10 w-10"></div></div>;

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Total Faculty', value: stats.totalFaculty, icon: UserCheck, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { label: 'Active Courses', value: stats.activeCourses, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { label: 'Pending Fees (₹)', value: stats.pendingFees.toLocaleString(), icon: DollarSign, color: 'text-rose-500', bg: 'bg-rose-100' },
  ];

  const pieColors = ['#22c55e', '#ef4444'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Enterprise Control Center</h2>
          <p className="text-slate-500 text-lg font-medium mt-1">High-level institutional monitoring & analytics.</p>
        </div>
        <button onClick={() => setActiveTab('Users')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2">
          <Activity size={18}/> Manage Users
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="card flex items-center gap-5 border border-slate-100 hover:shadow-xl transition-all">
            <div className={`p-4 rounded-2xl ${s.bg}`}>
              <s.icon size={28} className={s.color} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-black text-slate-800 dark:text-white mt-1">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 card">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Activity className="text-blue-500"/> Global Attendance Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1 card flex flex-col">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><FileText className="text-indigo-500"/> Pass/Fail Ratio</h3>
          <p className="text-sm text-slate-500 mb-6">Aggregated mid-term results.</p>
          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.passFail} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {stats.passFail.map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-sm font-bold text-slate-600">Pass (75%)</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span><span className="text-sm font-bold text-slate-600">Fail (25%)</span></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
export default AdminOverview;
