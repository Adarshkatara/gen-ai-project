import React, { useState } from 'react';
import { Shield, User, GraduationCap, LayoutDashboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminRoleSwitcher = ({ currentMode, setMode }) => {
  const [open, setOpen] = useState(false);
  
  const modes = [
    { id: 'Admin', icon: Shield, color: 'bg-blue-600 shadow-blue-500/50', label: 'Master Admin' },
    { id: 'Faculty', icon: User, color: 'bg-red-600 shadow-red-500/50', label: 'Faculty View' },
    { id: 'Student', icon: GraduationCap, color: 'bg-indigo-600 shadow-indigo-500/50', label: 'Student View' }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[200]">
      <div className="relative">
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} className="absolute bottom-16 left-0 bg-slate-900/90 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl p-2 w-64 flex flex-col gap-1">
              <div className="px-3 py-3 border-b border-slate-800 mb-2">
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><LayoutDashboard size={14} className="text-white"/> View Simulator</h4>
                <p className="text-[10px] text-slate-500 mt-1">Super-Admin Privilege Bypass</p>
              </div>
              {modes.map(m => (
                <button key={m.id} onClick={() => { setMode(m.id); setOpen(false); }} className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${currentMode === m.id ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'}`}>
                  <div className={`p-1.5 rounded-lg shadow-lg ${m.color} text-white`}><m.icon size={18}/></div>
                  <span className="font-bold text-sm tracking-wide">{m.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <button onClick={() => setOpen(!open)} className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${open ? 'bg-slate-800 text-white border border-slate-700' : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-2 border-blue-400/30 font-bold relative group'}`}>
          {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-emerald-500/50 shadow-lg"></span>}
          {open ? <X size={24}/> : <Shield size={24}/>}
        </button>
      </div>
    </div>
  );
};

export default AdminRoleSwitcher;
