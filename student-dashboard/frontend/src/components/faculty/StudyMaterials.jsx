import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, File, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const StudyMaterials = () => {
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const fetchData = async () => {
    try {
      const [cRes, mRes] = await Promise.all([ axios.get('/api/faculty/courses'), axios.get('/api/faculty/materials') ]);
      setCourses(cRes.data);
      if (cRes.data.length > 0) setCourseId(cRes.data[0].id);
      setMaterials(mRes.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/faculty/materials', { course_id: courseId, title, description, file_url: fileUrl, upload_date: new Date().toISOString().split('T')[0] });
      setTitle(''); setDescription(''); setFileUrl('');
      fetchData();
      alert('Material published successfully');
    } catch (err) { alert('Failed to publish material'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 card h-fit">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Upload className="text-primary"/> Upload Material</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Course</label>
            <select value={courseId} onChange={e=>setCourseId(e.target.value)} required className="w-full bg-red-50 border-none rounded-xl p-3 text-sm">
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Document Title</label>
            <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full bg-red-50 border-none rounded-xl p-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input type="text" value={description} onChange={e=>setDescription(e.target.value)} required className="w-full bg-red-50 border-none rounded-xl p-3 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Asset URL (PDF/Drive Link)</label>
            <input type="text" value={fileUrl} onChange={e=>setFileUrl(e.target.value)} required className="w-full bg-red-50 border-none rounded-xl p-3 text-sm" placeholder="https://..." />
          </div>
          <button type="submit" className="btn-faculty w-full justify-center">Publish to Students</button>
        </form>
      </div>
      
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-black"><FileText className="text-primary"/> Shared Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((m, i) => (
            <motion.div initial={{ scale: 0.9, opacity: 0}} animate={{ scale: 1, opacity: 1}} transition={{ delay: i * 0.1}} key={i} className="card hover:shadow-lg transition-shadow border border-slate-100 flex items-start gap-4">
              <div className="bg-red-50 text-red-500 p-3 rounded-xl"><File size={24}/></div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase">{m.course_name}</span>
                <h4 className="font-bold text-black mt-1">{m.title}</h4>
                <p className="text-xs text-slate-500 mt-1 mb-2 line-clamp-2">{m.description}</p>
                <a href={m.file_url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline">View Document &rarr;</a>
              </div>
            </motion.div>
          ))}
        </div>
        {materials.length === 0 && <p className="text-slate-500 text-center py-10 card">No materials uploaded yet.</p>}
      </div>
    </motion.div>
  );
};
export default StudyMaterials;
