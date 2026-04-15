import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, BookOpen, FileText, CheckCircle, Clock, Calendar, ArrowRight, Zap, Bell, CheckSquare, Upload, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 82 },
  { name: 'Thu', attendance: 90 },
  { name: 'Fri', attendance: 87 },
  { name: 'Sat', attendance: 95 },
];

const todayClasses = [
  { time: '09:00 AM', course: 'CS201 Data Structures', room: 'Lab 4', type: 'Practical' },
  { time: '11:30 AM', course: 'ME301 Thermodynamics', room: 'Hall B', type: 'Lecture' },
  { time: '02:00 PM', course: 'CS201 Data Structures', room: 'Room 102', type: 'Tutorial' },
];

const recentActivity = [
  { id: 1, text: 'Alice submitted "Advanced Trees"', time: '10 mins ago', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 2, text: 'System: Attendance marked for CS201', time: '1 hour ago', icon: CheckSquare, color: 'text-red-500', bg: 'bg-red-100' },
  { id: 3, text: 'Bob requested assignment extension', time: '3 hours ago', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-100' },
];

const FacultyOverview = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/faculty/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div className="text-slate-500 flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const statCards = [
    { label: 'Total Enrolled', value: stats.totalStudents, icon: Users, color: 'text-red-500', bg: 'bg-red-100' },
    { label: 'Classes Today', value: stats.classesToday, icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { label: 'Pending Due', value: stats.pendingAssignments, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: 'Avg Attendance', value: `${stats.attendanceRate}%`, icon: CheckCircle, color: 'text-rose-500', bg: 'bg-rose-100' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black text-black dark:text-white tracking-tight bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">Faculty Interface</h2>
          <p className="text-slate-500 text-lg font-medium mt-1">Your academic command center.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setActiveTab('Attendance')} className="btn-faculty py-2 px-4 flex items-center gap-2"><CheckSquare size={16}/> Log Attendance</button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
            key={idx} className="card flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className={`p-4 rounded-2xl ${s.bg}`}>
              <s.icon size={28} className={s.color} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-black text-black dark:text-white mt-1">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Chart & Timetable */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Target className="text-red-500"/> Attendance Trends (Weekly)</h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dummyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Timetable */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Clock className="text-emerald-500"/> Today's Schedule</h3>
            <div className="space-y-4">
              {todayClasses.map((cls, i) => (
                <div key={i} className="flex items-stretch gap-4 p-4 rounded-2xl bg-red-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 transition-colors">
                  <div className="flex flex-col justify-center items-center px-4 border-r border-slate-200 dark:border-slate-700 w-28">
                    <span className="text-xs font-bold text-slate-400">SESSION</span>
                    <span className="text-sm font-black text-emerald-600">{cls.time}</span>
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="font-bold text-black dark:text-white text-lg">{cls.course}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md">{cls.room}</span>
                      <span className="text-xs font-medium text-slate-500">{cls.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Quick Actions & Activity */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card bg-gradient-to-br from-red-900 to-slate-900 border-none">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-white"><Zap className="text-amber-400"/> Quick Access</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('Assignments')} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all text-left group">
                <FileText className="text-red-300 mb-3 group-hover:text-white transition-colors" size={24}/>
                <span className="block text-sm font-bold text-white">Create Assign.</span>
              </button>
              <button onClick={() => setActiveTab('Materials')} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all text-left group">
                <Upload className="text-emerald-300 mb-3 group-hover:text-white transition-colors" size={24}/>
                <span className="block text-sm font-bold text-white">Upload Material</span>
              </button>
              <button onClick={() => setActiveTab('Students')} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all text-left group">
                <Users className="text-rose-300 mb-3 group-hover:text-white transition-colors" size={24}/>
                <span className="block text-sm font-bold text-white">View Directory</span>
              </button>
              <button onClick={() => setActiveTab('Marks')} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 transition-all text-left group">
                <CheckCircle className="text-amber-300 mb-3 group-hover:text-white transition-colors" size={24}/>
                <span className="block text-sm font-bold text-white">Enter Grades</span>
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="card">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Calendar className="text-rose-500"/> Recent Activity</h3>
            <div className="space-y-6">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex gap-4 relative">
                  <div className="absolute left-[19px] top-10 bottom-[-24px] w-px bg-slate-200 dark:bg-slate-700 last:hidden"></div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${act.bg} ${act.color}`}>
                    <act.icon size={18} />
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-black dark:text-slate-200 leading-snug">{act.text}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
              View All Logs <ArrowRight size={16}/>
            </button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};
export default FacultyOverview;
