import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, FileText, Upload, Clock, User, Shield, Users, Video, BookOpen, Building, Bell, Star } from 'lucide-react';
import { RealtimeContext } from '../context/RealtimeContext';

export const FeeDetailsTab = () => {
  const [paid, setPaid] = useState(false);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-2"><CreditCard className="text-blue-500"/> Financial Registry</h2>
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-xl text-slate-800">Semester 4 Tuition Fee</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Due Date: 15th December</p>
          </div>
          <div className="text-right flex items-center gap-4">
             <span className="text-2xl font-black text-rose-500">₹45,000</span>
             <button disabled={paid} onClick={() => setPaid(true)} className={`px-6 py-3 rounded-xl font-bold text-white transition shadow-lg ${paid ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}>
                 {paid ? 'Cleared' : 'Pay Now'}
             </button>
          </div>
      </div>
    </motion.div>
  );
};

export const RegistrationTab = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><FileText className="text-indigo-500"/> Core Subject Registration</h2>
      <form onSubmit={(e)=>{e.preventDefault(); setSubmitted(true);}} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Select Open Elective</label>
          <select disabled={submitted} required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
            <option value="">Choose a subject...</option>
            <option>Advanced Machine Learning</option>
            <option>Cybersecurity Cryptography</option>
            <option>Cloud Infrastructure</option>
          </select>
        </div>
        <button disabled={submitted} type="submit" className={`w-full py-3 rounded-xl font-bold text-white transition ${submitted ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          {submitted ? 'Registration Confirmed!' : 'Lock Choices'}
        </button>
      </form>
    </motion.div>
  );
};

export const ExamSectionTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Clock className="text-amber-500"/> Examination Gateway</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border-2 border-dashed border-amber-200 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-amber-100 transition cursor-pointer">
          <Upload size={32} className="text-amber-500 mb-2"/>
          <h3 className="font-bold text-slate-800">Upload Final Assignment</h3>
          <p className="text-xs text-slate-500 mt-1">Max size: 50MB (PDF)</p>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-center">
          <h3 className="font-bold text-slate-800 mb-4">Admit Card Vault</h3>
          <button className="w-full py-3 text-sm font-bold bg-slate-800 text-white rounded-xl hover:bg-black transition">Download Final Term PDF</button>
        </div>
      </div>
    </motion.div>
  );
};

export const AccountManagerTab = () => {
  const [saved, setSaved] = useState(false);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card max-w-2xl">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><User className="text-sky-500"/> Profile Identity</h2>
      <form onSubmit={(e)=>{e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false), 2000)}} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-bold text-slate-500">Recovery Email</label><input type="email" placeholder="student@backup.com" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" /></div>
          <div><label className="text-xs font-bold text-slate-500">Contact Number</label><input type="tel" placeholder="+1 234 567 8900" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" /></div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500">Personal Bio</label>
          <textarea rows="3" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" placeholder="I am a Computer Science major..."></textarea>
        </div>
        <button type="submit" className={`w-full py-3 rounded-xl font-bold text-white transition ${saved ? 'bg-emerald-500' : 'bg-sky-600 hover:bg-sky-700'}`}>{saved ? 'Profile Updated!' : 'Save Changes'}</button>
      </form>
    </motion.div>
  );
};

export const PoliciesViewerTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Shield className="text-purple-500"/> Institutional Rules</h2>
      <div className="space-y-3">
        {['Academic Integrity & Plagiarism', 'Campus Curfew & Security', 'IT Hardware Usage Rights'].map((policy, i) => (
          <details key={i} className="group bg-slate-50 border border-slate-200 rounded-xl p-4">
            <summary className="font-bold text-slate-800 cursor-pointer list-none flex justify-between">{policy} <span className="text-purple-500 font-black">+</span></summary>
            <p className="text-sm leading-relaxed text-slate-500 mt-3 pt-3 border-t border-slate-200">Failure to comply with these standardized institutional operating procedures may result in temporary suspension of ERP portal access.</p>
          </details>
        ))}
      </div>
    </motion.div>
  );
};

export const AdvisorConnectTab = () => {
  const [requested, setRequested] = useState(false);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Users className="text-emerald-500"/> Academic Mentorship</h2>
      <div className="flex gap-4 items-center bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex justify-center items-center font-bold text-xl">S</div>
        <div><h3 className="font-bold text-emerald-900">Dr. Sarah Jenkins</h3><p className="text-xs font-semibold text-emerald-700">Lead Department Advisor</p></div>
      </div>
      <form onSubmit={(e)=>{e.preventDefault(); setRequested(true);}} className="space-y-4 max-w-md">
        <input type="date" required className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
        <textarea required placeholder="Reason for meeting..." rows="2" className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50"></textarea>
        <button disabled={requested} type="submit" className={`w-full py-3 rounded-xl font-bold text-white transition ${requested ? 'bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-700'}`}>{requested ? 'Request Dispatched!' : 'Book Appointment'}</button>
      </form>
    </motion.div>
  );
};

export const OnlineClassTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Video className="text-rose-500"/> Live Virtual Nodes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Advanced Data Structures at 10:00 AM', 'Compiler Design at 1:00 PM'].map((cls, i) => (
          <div key={i} className="p-5 border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-rose-300 transition-all bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500 transform origin-top group-hover:scale-y-110 transition"></div>
            <h3 className="font-bold text-slate-800 text-lg pr-4">{cls}</h3>
            <p className="text-sm text-slate-500 mb-4">Zoom Integration</p>
            <button className="px-5 py-2 rounded-lg bg-rose-50 text-rose-600 font-bold hover:bg-rose-500 hover:text-white transition w-full shadow-sm">Join Live Feed</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const FacilitiesTab = () => {
  const [opt, setOpt] = useState('hostel');
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Building className="text-cyan-500"/> Institutional Facilities</h2>
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {['hostel', 'mess', 'transport'].map(f => (
          <button key={f} onClick={()=>setOpt(f)} className={`px-4 py-2 capitalize font-bold text-sm rounded-lg transition ${opt === f ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{f}</button>
        ))}
      </div>
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl min-h-[150px] flex items-center justify-center text-center">
        {opt === 'hostel' && <div><h3 className="font-bold text-lg mb-2">Block A - Room 402</h3><p className="text-slate-500 text-sm">Rent cleared until next semester.</p></div>}
        {opt === 'mess' && <div><h3 className="font-bold text-lg mb-2">Non-Veg Plan Active</h3><button className="text-cyan-600 font-bold text-sm mt-2 hover:underline">Change Preference</button></div>}
        {opt === 'transport' && <div><h3 className="font-bold text-lg mb-2">Route 14 Bus Pass Valid</h3><button className="text-cyan-600 font-bold text-sm mt-2 hover:underline">View Live Map Track</button></div>}
      </div>
    </motion.div>
  );
};

export const ValueAddedProgramsTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><BookOpen className="text-pink-500"/> Skill Escalation Programs</h2>
      <div className="space-y-4">
        {['AWS Cloud Architecting', 'Python Django Bootcamp'].map((prog, i) => (
          <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
            <h3 className="font-bold text-slate-800">{prog}</h3>
            <button className="px-4 py-2 bg-pink-100 text-pink-600 font-bold rounded-lg hover:bg-pink-600 hover:text-white transition">Enroll</button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const AcademicFeedbacksTab = () => {
  const [rating, setRating] = useState(0);
  const [done, setDone] = useState(false);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card max-w-xl">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Star className="text-yellow-500"/> Professor Rating Matrix</h2>
      <form onSubmit={(e)=>{e.preventDefault(); setDone(true);}} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Rate Computer Networks Instructor</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(star => (
              <Star key={star} onClick={()=>setRating(star)} className={`cursor-pointer transition ${rating >= star ? 'text-yellow-400 fill-yellow-400 scale-110' : 'text-slate-300'}`} size={32}/>
            ))}
          </div>
        </div>
        <textarea required rows="3" placeholder="Provide anonymous constructive feedback..." className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
        <button disabled={done} type="submit" className={`w-full py-3 rounded-xl font-bold text-white transition ${done ? 'bg-yellow-500' : 'bg-slate-900 hover:bg-black'}`}>{done ? 'Recorded Anonymously!' : 'Submit Evaluation'}</button>
      </form>
    </motion.div>
  );
};

export const NotificationsTab = () => {
  const { notifications } = useContext(RealtimeContext);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><Bell className="text-violet-500"/> Communications Relay</h2>
      <div className="space-y-3">
        {notifications.length > 0 ? notifications.map(n => (
          <div key={n.id} className="p-4 border border-violet-100 bg-violet-50/50 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
            <h3 className="font-bold text-slate-800 flex justify-between">{n.title} <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">{n.created_at}</span></h3>
            <p className="text-sm font-medium text-slate-600 mt-2">{n.message}</p>
          </div>
        )) : <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl"><Bell size={32} className="mx-auto text-slate-300 mb-2"/><p className="text-slate-500 font-bold">No active transmission logs.</p></div>}
      </div>
    </motion.div>
  );
};
