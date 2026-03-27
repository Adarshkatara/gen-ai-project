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
        <BookOpen className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Current Subjects</h3>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {subjects.map((sub, idx) => (
          <motion.div variants={item} key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 hover:border-primary/30 transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-md text-sm border border-indigo-100">
                {sub.code}
              </div>
              <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded gap-1">
                <BookOpen size={12} /> {sub.credits} Credits
              </div>
            </div>
            
            <h4 className="font-bold text-slate-800 text-[1.05rem] mb-1 line-clamp-1" title={sub.name}>
              {sub.name}
            </h4>
            
            <div className="flex items-center gap-3 mt-4">
              <img src={sub.facultyImage || `https://ui-avatars.com/api/?name=${sub.facultyName}&background=random`} alt={sub.facultyName} className="w-8 h-8 rounded-full shadow-sm group-hover:scale-110 transition-transform" />
              <div className="text-xs">
                <p className="text-slate-500 dark:text-slate-400">Faculty</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{sub.facultyName}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SubjectCards;
