import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
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
    <div className="card w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary" size={24} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Today's Schedule</h3>
        </div>
        <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">{today}</span>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="space-y-4"
      >
        {todaySchedule.length > 0 ? (
          todaySchedule.map((slot, idx) => (
            <motion.div variants={item} key={idx} className="flex gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:border-indigo-200 transition-all group overflow-hidden relative">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${slot.type === 'Lecture' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
              
              <div className="flex-1 pl-2">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{slot.subjectId?.name}</h4>
                  <span className={`text-[10px] uppercase font-bold tracking-wider border px-2 py-0.5 rounded-full ${slot.type === 'Lecture' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                    {slot.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-2 mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock size={14} className="text-indigo-400" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <MapPin size={14} className="text-rose-400" />
                    <span>{slot.roomNumber}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>No classes scheduled for today.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TimeTable;
