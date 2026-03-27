import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityAuditor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/logs')
      .then(res => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Inspecting Security Footprints...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-5xl">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2"><ShieldAlert className="text-rose-500"/> System Activity Audit Log</h2>
        <p className="text-slate-500 mb-8 border-b border-slate-100 pb-4">Permanent immutable ledger computing traces of all elevated admin executions.</p>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 py-4">
          {logs.map(log => (
            <div key={log.id} className="relative pl-6">
              <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-slate-800"></div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800">{log.action}</span>
                  <span className="text-xs font-mono text-slate-500 font-medium">{log.timestamp}</span>
                </div>
                <div className="flex gap-4 text-xs font-bold text-slate-400">
                  <span>Executor: {log.admin_name}</span>
                  <span>|</span>
                  <span className="text-blue-500">Module: {log.module}</span>
                </div>
              </div>
            </div>
          ))}
          {logs.length === 0 && <div className="pl-6 text-slate-500 font-medium">No actions detected since last ledger purge.</div>}
        </div>
      </div>
    </motion.div>
  );
};
export default ActivityAuditor;
