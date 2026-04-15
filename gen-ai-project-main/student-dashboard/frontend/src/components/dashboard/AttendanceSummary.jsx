import React from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AttendanceSummary = ({ attendance }) => {
  return (
    <div className="card h-full">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-indigo-600 dark:text-indigo-400" size={24} />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Attendance Summary</h3>
      </div>
      
      <div className="space-y-6">
        {attendance && attendance.length > 0 ? attendance.map((record, idx) => {
          const percentage = record.totalClasses === 0 ? 0 : Math.round((record.attendedClasses / record.totalClasses) * 100);
          
          let colorClass = "bg-emerald-500";
          let bgClass = "bg-slate-100 dark:bg-white/5";
          if (percentage < 50) {
            colorClass = "bg-rose-500";
          } else if (percentage < 75) {
            colorClass = "bg-amber-500";
          }

          return (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              key={idx} 
              className="group"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{record.subjectId?.name}</span>
                <span className="font-bold text-slate-900 dark:text-white">{percentage}%</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${bgClass} border border-slate-200/50 dark:border-white/5`}>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                  className={`h-full rounded-full ${colorClass}`}
                ></motion.div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right font-medium">
                {record.attendedClasses} / {record.totalClasses} classes attended
              </p>
            </motion.div>
          );
        }) : (
          <p className="text-slate-500 text-sm">No attendance records found.</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceSummary;
