import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { RealtimeContext } from '../context/RealtimeContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import AttendanceCirc from '../components/dashboard/AttendanceCirc';
import TimeTable from '../components/dashboard/TimeTable';
import SubjectCards from '../components/dashboard/SubjectCards';
import AttendanceSummary from '../components/dashboard/AttendanceSummary';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import FeedbackPanel from '../components/dashboard/FeedbackPanel';
import { MessageCircle, User, FileBarChart, Users, Building, Bell, Sparkles, BrainCircuit, Sun, Cloud, Moon, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PerformanceHeatmap from '../components/dashboard/PerformanceHeatmap';

import { FeeDetailsTab, RegistrationTab, ExamSectionTab, AccountManagerTab, PoliciesViewerTab, AdvisorConnectTab, OnlineClassTab, FacilitiesTab, ValueAddedProgramsTab, AcademicFeedbacksTab, NotificationsTab, AICopilotTab } from '../components/student/StudentInteractiveTabs';
import AIAcademicInsights from '../components/student/AIAcademicInsights';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { liveStats } = useContext(RealtimeContext);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const [data, setData] = useState({ attendance: [], timetable: [], subjects: [], attendanceTrends: [], aiInsights: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, timeRes, subRes, trendRes, aiRes] = await Promise.all([
          axios.get('/api/dashboard/attendance'),
          axios.get('/api/dashboard/timetable'),
          axios.get('/api/dashboard/subjects'),
          axios.get('/api/dashboard/attendance-trends'),
          axios.get('/api/ai/insights')
        ]);
        setData({ 
          attendance: attRes.data, 
          timetable: timeRes.data, 
          subjects: subRes.data, 
          attendanceTrends: trendRes.data,
          aiInsights: aiRes.data
        });
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-medium text-slate-500 dark:text-slate-400">Loading your dashboard...</div>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <Sun className="text-amber-400" size={32}/> };
    if (hour < 18) return { text: "Good Afternoon", icon: <Cloud className="text-sky-400" size={32}/> };
    return { text: "Good Evening", icon: <Moon className="text-indigo-400" size={32}/> };
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Fee Details': return <FeeDetailsTab />;
      case 'Registration': return <RegistrationTab />;
      case 'Exam Section': return <ExamSectionTab />;
      case 'Main Account': return <AccountManagerTab />;
      case 'Policies': return <PoliciesViewerTab />;
      case 'My Advisor': return <AdvisorConnectTab />;
      case 'Hostel/Mess/Transport': return <FacilitiesTab />;
      case 'Notifications': return <NotificationsTab />;
      case 'Online Class': return <OnlineClassTab />;
      case 'Value Added Course': return <ValueAddedProgramsTab />;
      case 'Academic Feedbacks':
      case 'Feedback Panel': return <AcademicFeedbacksTab />;
      case 'AI Copilot': return <AICopilotTab />;
      case 'Dashboard':
      default:
        return (
          <div className="space-y-8 pb-10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-20">
              <div>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                  {getGreeting().icon}
                  {getGreeting().text}, <span className="text-gradient-ai">{user?.name?.split(' ')[0] || 'Scholar'}</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Your academic metrics are synchronized. Here is your situational overview.</p>
              </div>
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }} onClick={() => setShowFeedback(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] transition-all focus:ring-4 focus:ring-indigo-500/20">
                <MessageCircle size={18} /> Support Desk
              </motion.button>
            </motion.div>

            {/* Quick Action Bar */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex overflow-x-auto gap-4 pb-2 custom-scrollbar">
               {[
                 { label: 'Pay Semester Fee', action: () => setActiveTab('Fee Details') },
                 { label: 'Join Next Live Node', action: () => setActiveTab('Online Class') },
                 { label: 'Connect to Advisor', action: () => setActiveTab('My Advisor') },
                 { label: 'Ask Nexus AI', action: () => setActiveTab('AI Copilot') },
               ].map((btn, i) => (
                 <button key={i} onClick={btn.action} className="whitespace-nowrap px-5 py-2.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-white/5 hover:border-indigo-400/50 hover:bg-white dark:hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-md">
                   {btn.label}
                 </button>
               ))}
            </motion.div>
            
            {/* Nexus Pulse Widget */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="nexus-pulse-card group">
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="badge-ai flex items-center gap-1.5"><Sparkles size={10}/> Nexus Pulse</span>
                    <span className="text-xs font-bold text-white/60 tracking-widest uppercase">{data.aiInsights?.priority} Priority Insight</span>
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">"{data.aiInsights?.summary}"</h2>
                  <div className="flex flex-wrap gap-3">
                    {data.aiInsights?.suggestions.map((s, i) => (
                      <div key={i} className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-xs font-semibold flex items-center gap-2">
                        <BrainCircuit size={14} className="text-indigo-300"/> {s}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-end">
                   <button onClick={() => setActiveTab('AI Copilot')} className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl hover:-translate-y-1">
                     Consult Nexus AI <MessageCircle size={16}/>
                   </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                 <BrainCircuit size={200} />
              </div>
            </motion.div>
            
            <AIAcademicInsights attendance={data.attendance} trends={data.attendanceTrends} />

            <PerformanceHeatmap />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 relative z-10">
              <div className="lg:col-span-2 space-y-8">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}><AttendanceChart data={data.attendanceTrends} /></motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><TimeTable timetable={data.timetable} /><AttendanceCirc attendance={data.attendance} /></div>
                <SubjectCards subjects={data.subjects} />
              </div>
              <div className="lg:col-span-1"><AttendanceSummary attendance={data.attendance} /></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#09090b] relative">
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-100"></div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto bg-transparent relative z-10">
        <div className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-white/10 backdrop-blur-xl border-b border-white/5">
           <div className="relative group max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search resources, nodes, or AI insights..." 
                className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/50 transition-all outline-none"
              />
           </div>
           <Navbar />
        </div>
        <main className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
          {renderContent()}
        </main>
      </div>
      {showFeedback && <FeedbackPanel onClose={() => setShowFeedback(false)} />}
    </div>
  );
};

export default Dashboard;
