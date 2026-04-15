import React from 'react';
import { Calendar, Clock, MapPin, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
};

const TimeTable = ({ timetable }) => {
  const todaySchedule = timetable || [];
  const today = todaySchedule.length > 0 ? todaySchedule[0]?.dayOfWeek : "No Classes";

  return (
    <div className="card w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-indigo-600 dark:text-indigo-400" size={24} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Today's Schedule</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full">{today}</span>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-4 flex-1"
      >
        {todaySchedule.length > 0 ? (
          todaySchedule.map((slot, idx) => (
            <motion.div variants={item} key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all group overflow-hidden relative">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Circle size={8} className={`fill-current ${slot.type === 'Lecture' ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{slot.subjectId?.name}</h4>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${slot.type === 'Lecture' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    {slot.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-5 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock size={14} className="text-slate-400" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{slot.roomNumber}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 flex flex-col items-center justify-center h-full border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No schedule available.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TimeTable;
