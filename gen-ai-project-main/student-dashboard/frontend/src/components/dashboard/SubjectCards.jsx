import React from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

const SubjectCards = ({ subjects }) => {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="card w-full">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="text-indigo-500" size={24} />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Current Subjects</h3>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {subjects.map((sub, idx) => (
          <motion.div variants={item} key={idx} className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-white/5 hover:border-transparent transition-all group cursor-pointer relative overflow-hidden backdrop-blur-sm z-10 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/10 dark:group-hover:from-indigo-500/10 dark:group-hover:to-purple-500/20 z-0 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-white dark:bg-black/40 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1.5 rounded-lg text-sm border border-slate-200 dark:border-white/10 shadow-sm">
                  {sub.code}
                </div>
                <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-black/40 px-2.5 py-1.5 rounded-lg gap-1 border border-slate-200 dark:border-white/10 shadow-sm">
                  <BookOpen size={12} className="text-indigo-500" /> {sub.credits} <span className="hidden sm:inline">Credits</span>
                </div>
              </div>
              
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[1.1rem] mb-2 line-clamp-2 leading-tight" title={sub.name}>
                {sub.name}
              </h4>
              
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200/60 dark:border-white/10">
                <img src={sub.facultyImage || `https://ui-avatars.com/api/?name=${sub.facultyName}&background=random`} alt={sub.facultyName} className="w-9 h-9 rounded-full shadow-md group-hover:scale-110 group-hover:ring-2 ring-indigo-500/50 transition-all duration-300" />
                <div className="text-xs">
                  <p className="text-slate-500 dark:text-slate-400 uppercase tracking-widest text-[9px] font-bold">Instructor</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{sub.facultyName}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SubjectCards;
