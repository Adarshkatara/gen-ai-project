import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { RealtimeContext } from '../../context/RealtimeContext';
import { Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount, notifications, markAsRead } = useContext(RealtimeContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Enforcing professional bright mode, removed dark mode logic
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  const toggleDark = () => {
    // Disabled
  };

  return (
    <nav className="h-16 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 hidden md:block tracking-wide">University ERP <span className="text-indigo-500">Professional</span></h2>
        <div className="relative hidden md:block ml-6 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input type="text" placeholder="Search the portal..." className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/30 rounded-full text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none w-64 text-slate-700 dark:text-slate-200 transition-all" />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button disabled className="hidden w-9 h-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-indigo-500 transition-colors">
          <Sun size={18} />
        </button>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-indigo-500 transition-colors group">
          <Bell size={18} className="group-hover:animate-swing" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping opacity-75"></span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50"></span>
            </>
          )}
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-white/10 pl-6 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all">{user?.name?.charAt(0) || 'U'}</div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user?.name}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{user?.role}</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 ml-1 group-hover:text-indigo-500" />
          <button onClick={logout} className="ml-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-rose-500 hover:text-white transition-colors">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
