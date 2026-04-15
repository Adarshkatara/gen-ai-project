import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

export const RealtimeContext = createContext();

export const RealtimeProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveStats, setLiveStats] = useState({});
  const [toasts, setToasts] = useState([]);

  const addToast = (notif) => {
    setToasts(prev => [...prev, notif]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== notif.id));
    }, 6000);
  };

  const markAsRead = async (id) => {
    try {
      await axios.post('/api/realtime/notifications/read', { id });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch(e) {}
  };

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;
    const pollData = async () => {
      try {
        const [notifRes, statsRes] = await Promise.all([
          axios.get('/api/realtime/notifications'),
          axios.get('/api/realtime/dashboard')
        ]);
        
        if (!isMounted) return;

        const newNotifs = notifRes.data;
        if (newNotifs.length > 0) {
          setNotifications(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            newNotifs.forEach(n => {
              if (!existingIds.has(n.id)) {
                addToast(n);
              }
            });
            return newNotifs; // Replace entirely or append, here we replace to stay in sync with server unread queue
          });
          setUnreadCount(newNotifs.length);
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
        
        setLiveStats(statsRes.data);
      } catch(e) { console.error("Polling Engine Offline", e); }
    };
    
    pollData();
    const interval = setInterval(pollData, 5000); // 5s high-speed polling
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  return (
    <RealtimeContext.Provider value={{ notifications, unreadCount, liveStats, markAsRead }}>
      {children}
      {/* Toast Notification Container Overlay */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 shadow-2xl shadow-black/50 rounded-2xl p-4 flex items-start gap-4 min-w-[320px] max-w-sm pointer-events-auto"
            >
              <div className={`mt-0.5 ${t.type==='Success'?'text-emerald-400':t.type==='Warning'?'text-amber-400':t.type==='Error'?'text-rose-400':'text-blue-400'}`}>
                {t.type==='Success'?<CheckCircle size={20}/>:t.type==='Warning'?<AlertTriangle size={20}/>:t.type==='Error'?<XCircle size={20}/>:<Info size={20}/>}
              </div>
              <div className="flex-1 pr-2">
                <h4 className="text-white font-bold text-sm tracking-wide">{t.title}</h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{t.message}</p>
              </div>
              <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="text-slate-500 hover:text-white transition"><X size={16}/></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </RealtimeContext.Provider>
  );
};
