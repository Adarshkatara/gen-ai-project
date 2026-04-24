import React from 'react';
import { motion } from 'framer-motion';

const PerformanceHeatmap = () => {
  // Mock data for 14 weeks (98 days)
  const generateData = () => {
    return Array.from({ length: 98 }, (_, i) => ({
      day: i,
      level: Math.floor(Math.random() * 5), // 0 to 4
    }));
  };

  const data = generateData();
  const months = ['Jan', 'Feb', 'Mar', 'Apr'];

  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'bg-slate-100 dark:bg-slate-800/50';
      case 1: return 'bg-indigo-200 dark:bg-indigo-900/30';
      case 2: return 'bg-indigo-400 dark:bg-indigo-700/50';
      case 3: return 'bg-indigo-600 dark:bg-indigo-500/70';
      case 4: return 'bg-indigo-800 dark:bg-indigo-400';
      default: return 'bg-slate-100';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="card bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Academic Consistency</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Study activity and attendance over the last semester</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(l => (
              <div key={l} className={`w-3 h-3 rounded-sm ${getLevelColor(l)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex flex-col gap-2 min-w-[600px]">
          <div className="flex gap-1 mb-1">
            {months.map(m => (
              <div key={m} className="flex-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m}</div>
            ))}
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-1.5">
            {data.map((d, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, zIndex: 50 }}
                className={`w-4 h-4 rounded-sm ${getLevelColor(d.level)} transition-colors cursor-pointer relative group`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                   <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-xl">
                      Day {d.day}: {d.level > 2 ? 'High Activity' : 'Normal'}
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceHeatmap;
