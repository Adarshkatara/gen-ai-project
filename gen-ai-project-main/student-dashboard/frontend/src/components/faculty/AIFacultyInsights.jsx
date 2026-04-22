import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIFacultyInsights = () => {
  const [activeInsight, setActiveInsight] = useState(0);

  const insights = [
    {
      id: 1,
      type: 'Risk Alert',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgClass: 'bg-red-500/10 border-red-500/20',
      message: '3 students in CS202 have dropped off in attendance this week. Consider an early intervention.'
    },
    {
      id: 2,
      type: 'Smart Summary',
      icon: Lightbulb,
      color: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
      message: 'You have 15 unsorted assignments ready for grading and 2 extension requests pending.'
    },
    {
      id: 3,
      type: 'Performance Trend',
      icon: TrendingUp,
      color: 'text-indigo-400',
      bgClass: 'bg-indigo-500/10 border-indigo-500/20',
      message: 'Global average marks across all your subjects are up by 4.2% since the mid-terms. Great job!'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [insights.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="relative z-20 mt-4 mb-8"
    >
      <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent z-0 pointer-events-none group-hover:from-indigo-500/10 transition-colors duration-700"></div>
        
        <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30 relative z-10 flex-shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Sparkles className="text-indigo-400 animate-pulse" size={24} />
        </div>
        
        <div className="flex-1 relative z-10 overflow-hidden h-14 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeInsight}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className={`flex items-center gap-3 border px-4 py-2.5 rounded-xl w-full ${insights[activeInsight].bgClass}`}
            >
              <div className="flex items-center justify-center p-1 bg-black/20 rounded-md">
                 {React.createElement(insights[activeInsight].icon, { size: 16, className: insights[activeInsight].color })}
              </div>
              <div className="flex-1">
                <span className="text-white text-sm font-bold block leading-tight">{insights[activeInsight].type}</span>
                <span className="text-slate-300 text-xs font-medium leading-tight block mt-0.5">{insights[activeInsight].message}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 hidden md:block border-l border-white/10 pl-4 py-1">
           <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400/80 mb-1">Nexus AI Engine</p>
           <p className="text-xs font-semibold text-slate-300">Faculty Insights Beta</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AIFacultyInsights;
