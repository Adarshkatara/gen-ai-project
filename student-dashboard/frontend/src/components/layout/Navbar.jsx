import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { RealtimeContext } from '../../context/RealtimeContext';
import { Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount, notifications, markAsRead } = useContext(RealtimeContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <nav className="h-16 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hidden md:block">University ERP</h2>
        <div className="relative hidden md:block ml-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search the portal..." className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 text-slate-700 dark:text-slate-200" />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button onClick={toggleDark} className="text-slate-500 hover:text-indigo-500 transition-colors">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative cursor-pointer group">
          <Bell size={20} className="text-slate-500 hover:text-indigo-500 transition-colors" />
          {/* Dynamic real-time badge */}
          {unreadCount > 0 && (
             <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse shadow-lg shadow-rose-500/40">
               {unreadCount}
             </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-md">{user?.name?.charAt(0) || 'U'}</div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{user?.name}</p>
            <p className="text-xs font-medium text-slate-400">{user?.role}</p>
          </div>
          <button onClick={logout} className="ml-4 text-xs font-bold px-3 py-1.5 rounded bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">Log Out</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
