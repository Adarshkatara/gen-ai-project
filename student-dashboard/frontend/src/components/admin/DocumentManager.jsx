import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileDown, Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';

const DocumentManager = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Upload Form state
  const [title, setTitle] = useState('');
  const [audience, setAudience] = useState('All');

  const fetchDocs = async () => {
    try {
      const res = await axios.get('/api/admin/documents');
      setDocs(res.data);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/documents', { title, target_audience: audience, file_url: `/docs/${title.replace(/\s+/g, '_').toLowerCase()}.pdf` });
      setTitle('');
      fetchDocs();
    } catch(err) { alert('Failed processing file pointer'); }
  };

  if (loading) return <div>Accessing Datastores...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
      <div className="lg:col-span-1 border-r border-slate-200 pr-0 lg:pr-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Upload className="text-blue-500"/> Dispatch Document</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Document Title</label>
            <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Revised Exam Guidelines" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Target Permission Role</label>
            <select value={audience} onChange={e=>setAudience(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="All">Global (All Users)</option>
              <option value="Faculty">Faculty Operations Only</option>
              <option value="Students">Student Portal Only</option>
            </select>
          </div>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50 hover:bg-blue-50 transition cursor-pointer group">
            <Upload size={32} className="mx-auto text-slate-400 group-hover:text-blue-500 mb-2 transition" />
            <p className="text-sm font-bold text-slate-500 group-hover:text-blue-600">Select PDF File...</p>
          </div>
          <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition">Commence Upload</button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><File className="text-emerald-500"/> Institutional Archives</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {docs.map(d => (
            <div key={d.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start gap-4 hover:shadow-lg transition">
              <div className="p-3 bg-red-50 text-red-500 rounded-xl"><FileDown size={24}/></div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 leading-tight mb-1">{d.title}</h4>
                <div className="flex gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{d.target_audience}</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{d.upload_date}</span>
                </div>
                <a href={d.file_url} className="text-xs font-bold text-slate-400 hover:text-slate-700 transition underline underline-offset-2">Download Object</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
export default DocumentManager;
