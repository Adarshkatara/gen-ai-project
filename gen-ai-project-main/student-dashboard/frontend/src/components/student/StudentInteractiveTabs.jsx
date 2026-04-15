import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, FileText, Upload, Clock, User, Shield, Users, Video, BookOpen, Building, Bell, Star, AlertCircle, FileSearch } from 'lucide-react';
import { RealtimeContext } from '../../context/RealtimeContext';

export const FeeDetailsTab = () => {
  const [paid, setPaid] = useState(false);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 text-slate-800 dark:text-slate-100"><CreditCard className="text-indigo-600 dark:text-indigo-400" size={20}/> Financial Registry</h2>
      <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Semester 4 Tuition Fee</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Due Date: 15th December</p>
          </div>
          <div className="text-right flex items-center gap-4">
             <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹45,000</span>
             <button disabled={paid} onClick={() => setPaid(true)} className={`btn-primary ${paid ? 'opacity-50 cursor-not-allowed bg-emerald-600 hover:bg-emerald-600 tracking-normal' : ''}`}>
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
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><FileText className="text-indigo-600 dark:text-indigo-400" size={20}/> Core Subject Registration</h2>
      <form onSubmit={(e)=>{e.preventDefault(); setSubmitted(true);}} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Select Open Elective</label>
          <select disabled={submitted} required className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <option value="">Choose a subject...</option>
            <option>Advanced Machine Learning</option>
            <option>Cybersecurity Cryptography</option>
            <option>Cloud Infrastructure</option>
          </select>
        </div>
        <button disabled={submitted} type="submit" className={`btn-primary w-full ${submitted ? 'bg-emerald-600 hover:bg-emerald-600 opacity-90' : ''}`}>
          {submitted ? 'Registration Confirmed' : 'Lock Choices'}
        </button>
      </form>
    </motion.div>
  );
};

export const ExamSectionTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><Clock className="text-indigo-600 dark:text-indigo-400" size={20}/> Examination Gateway</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-white/5 rounded-xl flex flex-col items-center justify-center text-center hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer">
          <Upload size={24} className="text-slate-500 dark:text-slate-400 mb-3"/>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Upload Final Assignment</h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Max size: 50MB (PDF)</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl flex flex-col justify-center">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Admit Card Vault</h3>
          <button className="btn-primary w-full bg-slate-800 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600">Download Final Term PDF</button>
        </div>
      </div>
    </motion.div>
  );
};

export const AccountManagerTab = () => {
  const [saved, setSaved] = useState(false);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card max-w-2xl">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><User className="text-indigo-600 dark:text-indigo-400" size={20}/> Profile Identity</h2>
      <form onSubmit={(e)=>{e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false), 2000)}} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Recovery Email</label><input type="email" placeholder="student@backup.com" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
          <div><label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Contact Number</label><input type="tel" placeholder="+1 234 567 8900" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none" /></div>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Personal Bio</label>
          <textarea rows="3" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder="I am a Computer Science major..."></textarea>
        </div>
        <button type="submit" className={`btn-primary w-full ${saved ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}>{saved ? 'Profile Updated' : 'Save Changes'}</button>
      </form>
    </motion.div>
  );
};

export const PoliciesViewerTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><Shield className="text-indigo-600 dark:text-indigo-400" size={20}/> Institutional Rules</h2>
      <div className="space-y-3">
        {['Academic Integrity & Plagiarism', 'Campus Curfew & Security', 'IT Hardware Usage Rights'].map((policy, i) => (
          <details key={i} className="group bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 transition-all">
            <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer list-none flex justify-between items-center outline-none">
              {policy} 
              <span className="text-indigo-500 font-bold group-open:rotate-45 transition-transform duration-200">+</span>
            </summary>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">Failure to comply with these standardized institutional operating procedures may result in temporary suspension of ERP portal access. Please act responsibly.</p>
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
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><Users className="text-indigo-600 dark:text-indigo-400" size={20}/> Academic Mentorship</h2>
      <div className="flex gap-4 items-center bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 mb-6 w-fit">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex justify-center items-center font-bold text-lg">S</div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Dr. Sarah Jenkins</h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lead Department Advisor</p>
        </div>
      </div>
      <form onSubmit={(e)=>{e.preventDefault(); setRequested(true);}} className="space-y-4 max-w-md">
        <input type="date" required className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none" />
        <textarea required placeholder="Reason for meeting..." rows="2" className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none"></textarea>
        <button disabled={requested} type="submit" className={`btn-primary w-full ${requested ? 'bg-indigo-400 opacity-80 cursor-not-allowed' : ''}`}>{requested ? 'Request Dispatched' : 'Book Appointment'}</button>
      </form>
    </motion.div>
  );
};

export const OnlineClassTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><Video className="text-indigo-600 dark:text-indigo-400" size={20}/> Live Virtual Nodes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Advanced Data Structures at 10:00 AM', 'Compiler Design at 1:00 PM'].map((cls, i) => (
          <div key={i} className="p-5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all bg-slate-50 dark:bg-white/5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-1">{cls}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5"><AlertCircle size={12}/> Mandatory Attendance</p>
            </div>
            <button className="py-2.5 px-4 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-600 hover:text-white transition-colors w-full text-sm shadow-sm border border-indigo-100 dark:border-indigo-500/20">Join Live Feed</button>
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
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><Building className="text-indigo-600 dark:text-indigo-400" size={20}/> Institutional Facilities</h2>
      <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-200 dark:border-white/5">
        {['hostel', 'mess', 'transport'].map(f => (
          <button key={f} onClick={()=>setOpt(f)} className={`px-4 py-1.5 capitalize font-semibold text-sm rounded-lg transition-colors ${opt === f ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>{f}</button>
        ))}
      </div>
      <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl min-h-[120px] flex items-center justify-center text-center">
        {opt === 'hostel' && <div><h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Block A - Room 402</h3><p className="text-slate-500 dark:text-slate-400 text-sm">Rent cleared until next semester.</p></div>}
        {opt === 'mess' && <div><h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Non-Veg Plan Active</h3><button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">Change Preference</button></div>}
        {opt === 'transport' && <div><h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Route 14 Bus Pass Valid</h3><button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">View Live Map Track</button></div>}
      </div>
    </motion.div>
  );
};

export const ValueAddedProgramsTab = () => {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><BookOpen className="text-indigo-600 dark:text-indigo-400" size={20}/> Skill Escalation Programs</h2>
      <div className="space-y-3">
        {['AWS Cloud Architecting', 'Python Django Bootcamp'].map((prog, i) => (
          <div key={i} className="flex justify-between items-center p-4 border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm md:text-base">{prog}</h3>
            <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm rounded-lg hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/5">Enroll</button>
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
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><Star className="text-indigo-600 dark:text-indigo-400" size={20}/> Professor Evaluation</h2>
      <form onSubmit={(e)=>{e.preventDefault(); setDone(true);}} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Rate Computer Networks Instructor</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(star => (
              <Star key={star} onClick={()=>setRating(star)} className={`cursor-pointer transition-colors ${rating >= star ? 'text-indigo-500 fill-indigo-500' : 'text-slate-200 dark:text-slate-700 hover:text-indigo-300'}`} size={28}/>
            ))}
          </div>
        </div>
        <textarea required rows="3" placeholder="Provide anonymous constructive feedback..." className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50"></textarea>
        <button disabled={done} type="submit" className={`btn-primary w-full ${done ? 'opacity-80 bg-emerald-600 hover:bg-emerald-600 cursor-not-allowed' : ''}`}>{done ? 'Submission Recorded' : 'Submit Evaluation'}</button>
      </form>
    </motion.div>
  );
};

export const NotificationsTab = () => {
  const { notifications } = useContext(RealtimeContext);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="card">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-100"><Bell className="text-indigo-600 dark:text-indigo-400" size={20}/> Communications Relay</h2>
      <div className="space-y-3">
        {notifications.length > 0 ? notifications.map(n => (
          <div key={n.id} className="p-4 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 rounded-xl flex gap-3 items-start">
            <div className="mt-0.5 text-indigo-500"><AlertCircle size={16}/></div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between text-sm items-center">
                {n.title} 
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{n.created_at}</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
            </div>
          </div>
        )) : <div className="py-10 text-center"><FileSearch size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3"/><p className="text-slate-500 dark:text-slate-400 font-medium">No active communications.</p></div>}
      </div>
    </motion.div>
  );
};
