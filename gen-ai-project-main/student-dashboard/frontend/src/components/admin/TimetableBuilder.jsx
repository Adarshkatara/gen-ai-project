import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const TimetableBuilder = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/timetable')
      .then(res => setSchedule(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Scheduling Data...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Master Timetable Matrix</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={18}/> Draft Global Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map(s => (
            <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition"></div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Clock size={16}/> {s.day} @ {s.time}
                </div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{s.course}</h3>
                <div className="flex gap-4 border-t border-slate-200 pt-3 mt-3">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Room: {s.room}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-500"><Users size={12}/> {s.faculty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default TimetableBuilder;
