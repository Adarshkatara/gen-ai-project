import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    try {
      const res = await axios.get('/api/admin/fees');
      setFees(res.data);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchFees(); }, []);

  const totalPending = fees.filter(f => f.status === 'Pending').reduce((acc, f) => acc + parseFloat(f.amount), 0);

  if (loading) return <div>Loading Financial Ledgers...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card bg-gradient-to-br from-rose-500 to-red-600 text-white border-none">
          <AlertTriangle className="text-rose-200 mb-4" size={32}/>
          <p className="font-bold text-rose-100 mb-1 leading-none uppercase tracking-wide text-sm">Deficit (Total Pending)</p>
          <p className="text-4xl font-black">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none">
          <CheckCircle className="text-emerald-200 mb-4" size={32}/>
          <p className="font-bold text-emerald-100 mb-1 leading-none uppercase tracking-wide text-sm">System Status</p>
          <p className="text-4xl font-black">Active</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><CreditCard className="text-blue-500"/> Financial Registry</h2>
        
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Student Context</th>
                <th className="px-6 py-4">Total Amount (INR)</th>
                <th className="px-6 py-4">Settlement Status</th>
                <th className="px-6 py-4 text-right">Receipts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map(f => (
                <tr key={f.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono text-slate-400 text-xs">TRX-000{f.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{f.student_name}</td>
                  <td className="px-6 py-4 text-lg font-black text-slate-700">₹{parseFloat(f.amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition" title="Print Output"><FileText size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
export default FeeManagement;
