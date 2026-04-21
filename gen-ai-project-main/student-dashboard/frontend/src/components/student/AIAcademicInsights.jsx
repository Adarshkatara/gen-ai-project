import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AIAcademicInsights = ({ attendance = [], trends = [] }) => {
  // Let's generate a dynamic insight based on raw attendance data.
  let insightText = "You are currently performing well, keeping your modules in balance.";
  let badgeContext = "Optimal";
  let icon = <TrendingUp size={20} className="text-emerald-500" />;
  let colorTheme = "from-emerald-500 to-teal-500";
  
  if (attendance.length > 0) {
    const totalConducted = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
    const totalAttended = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
    const percentage = totalConducted === 0 ? 0 : Math.round((totalAttended / totalConducted) * 100);

    if (percentage < 75) {
      insightText = `Nexus AI notes your overall attendance is ${percentage}%. You need more classes to maintain exam eligibility.`;
      badgeContext = "Action Needed";
      icon = <AlertTriangle size={20} className="text-rose-500" />;
      colorTheme = "from-rose-500 to-orange-500";
    } else if (percentage >= 75 && percentage <= 85) {
      insightText = `Nexus AI recommends joining today's live online nodes to securely cross the 85% safety threshold.`;
      badgeContext = "Recommendation";
      icon = <Sparkles size={20} className="text-amber-500" />;
      colorTheme = "from-amber-400 to-orange-400";
    } else {
      insightText = "Excellent attendance tracking above standard threshold. Your Nexus sync is optimal.";
      badgeContext = "Excelling";
      icon = <Sparkles size={20} className="text-indigo-400" />;
      colorTheme = "from-indigo-500 to-purple-500";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-glow-panel bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-6 mt-8 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
    >
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorTheme}`}></div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between z-10 relative">
        <div className="flex gap-4">
            <div className="relative p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-500">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorTheme} opacity-10 group-hover:opacity-30 blur-md transition-opacity duration-500`}></div>
              <div className="relative z-10 animate-pulse">{icon}</div>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Nexus Copilot Insight</h3>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${colorTheme} text-white`}>
                        {badgeContext}
                    </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-sm max-w-xl leading-relaxed">
                    {insightText}
                </p>
            </div>
        </div>
        <button className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 text-white font-semibold text-sm hover:from-indigo-600 hover:to-purple-600 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-1 transition-all duration-300 outline-none focus:ring-4 focus:ring-indigo-500/30">
            View Analytics
        </button>
      </div>
    </motion.div>
  );
};

export default AIAcademicInsights;
