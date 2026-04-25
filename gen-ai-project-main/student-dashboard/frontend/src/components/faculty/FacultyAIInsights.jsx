import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrainCircuit, AlertTriangle, TrendingUp, User, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FacultyAIInsights = () => {
  const [data, setData] = useState({ atRiskStudents: [], performanceTrends: [], summary: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/faculty/ai-insights');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch AI insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center font-medium text-slate-500 animate-pulse">Analyzing institutional data points...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* AI Summary Header */}
      <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-200 dark:border-red-500/20 p-6 rounded-3xl relative overflow-hidden">
        <div className="flex items-start gap-4 relative z-10">
          <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-500/20">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              Nexus AI: At-Risk Analysis <Sparkles size={18} className="text-amber-500" />
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">{data.summary}</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <AlertTriangle size={150} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* At-Risk Students List */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> Critical Attention Required
          </h3>
          <div className="space-y-4">
            {data.atRiskStudents.length > 0 ? data.atRiskStudents.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-red-300 dark:hover:border-red-500/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 font-bold">
                    {s.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{s.full_name}</h4>
                    <p className="text-xs font-medium text-slate-500">{s.course_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-red-600 dark:text-red-400">{s.attendance_rate.toFixed(1)}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</div>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-500 font-medium bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                All students are above the risk threshold.
              </div>
            )}
          </div>
        </div>

        {/* Performance Trends */}
        <div className="card">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={20} /> Course Performance Velocity
          </h3>
          <div className="space-y-6">
            {data.performanceTrends.map((t, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{t.course_name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{t.avg_marks.toFixed(1)}% Avg</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${t.avg_marks}%` }} 
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`h-full rounded-full ${t.avg_marks > 80 ? 'bg-emerald-500' : t.avg_marks > 60 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
             <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Nexus Pro-Tip</h4>
             <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">"The Data Structures course is seeing a 12% dip in mid-term scores compared to last year. Consider scheduling a remedial node."</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FacultyAIInsights;
