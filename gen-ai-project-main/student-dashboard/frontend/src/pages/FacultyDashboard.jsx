import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import FacultyOverview from '../components/faculty/FacultyOverview';
import AttendanceMarking from '../components/faculty/AttendanceMarking';
import AssignmentManager from '../components/faculty/AssignmentManager';
import MarksEntry from '../components/faculty/MarksEntry';
import StudentDirectory from '../components/faculty/StudentDirectory';
import StudyMaterials from '../components/faculty/StudyMaterials';
import Announcements from '../components/faculty/Announcements';
import AIFacultyInsights from '../components/faculty/AIFacultyInsights';
import FacultyAIInsights from '../components/faculty/FacultyAIInsights';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showFeedback, setShowFeedback] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getPronoun = () => {
    // Assuming academic pronouns. Usually dynamic in a real app.
    return "Prof.";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Background glowing orbs for premium feel */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none z-0 animate-pulse mix-blend-multiply" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[60%] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none z-0 animate-pulse mix-blend-multiply" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-[0.03]"></div>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto bg-transparent relative z-10 fade-in-up transition-all duration-700">
        <Navbar />
        <main className="p-6 md:p-10 max-w-7xl mx-auto flex-1 animate-fade-in-up">
          
          {/* Global Header & Greeting block for Faculty */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-20 mb-2">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                {getGreeting()}, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{getPronoun()} {user?.name?.split(' ')[0] || 'Scholar'}</span>
              </h1>
              <p className="text-slate-400 mt-2 font-medium text-lg">Your academic metrics are synchronized. Here is your situational overview.</p>
            </div>
            <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }} onClick={() => setShowFeedback(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] transition-all focus:ring-4 focus:ring-indigo-500/20">
              <MessageCircle size={18} /> Support Desk
            </motion.button>
          </motion.div>

          {/* Quick Action Bar for Faculty */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex overflow-x-auto gap-4 py-4 custom-scrollbar relative z-20">
             {[
               { label: 'Mark Attendance', action: () => setActiveTab('Attendance') },
               { label: 'Enter Grades', action: () => setActiveTab('Marks') },
               { label: 'Analyze Risk (AI)', action: () => setActiveTab('AI Analysis') },
               { label: 'Upload Materials', action: () => setActiveTab('Materials') },
             ].map((btn, i) => (
               <button key={i} onClick={btn.action} className="whitespace-nowrap px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-xl font-semibold text-sm text-slate-700 border border-slate-200 hover:border-indigo-400 hover:bg-white hover:text-indigo-600 transition-all hover:-translate-y-1 shadow-sm">
                 {btn.label}
               </button>
             ))}
          </motion.div>

          <AIFacultyInsights />

          <div className="relative z-10 pt-4">
            {activeTab === 'Dashboard' && <FacultyOverview setActiveTab={setActiveTab} />}
            {activeTab === 'AI Analysis' && <FacultyAIInsights />}
            {activeTab === 'Attendance' && <AttendanceMarking />}
            {activeTab === 'Assignments' && <AssignmentManager />}
            {activeTab === 'Marks' && <MarksEntry />}
            {activeTab === 'Students' && <StudentDirectory />}
            {activeTab === 'Materials' && <StudyMaterials />}
            {activeTab === 'Messages' && <Announcements />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
