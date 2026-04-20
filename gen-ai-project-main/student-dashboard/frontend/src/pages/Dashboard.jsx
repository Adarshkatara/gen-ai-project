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
import { MessageCircle, User, FileBarChart, Users, Building, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

import { FeeDetailsTab, RegistrationTab, ExamSectionTab, AccountManagerTab, PoliciesViewerTab, AdvisorConnectTab, OnlineClassTab, FacilitiesTab, ValueAddedProgramsTab, AcademicFeedbacksTab, NotificationsTab, AICopilotTab } from '../components/student/StudentInteractiveTabs';
import AIAcademicInsights from '../components/student/AIAcademicInsights';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { liveStats } = useContext(RealtimeContext);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const [data, setData] = useState({ attendance: [], timetable: [], subjects: [], attendanceTrends: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, timeRes, subRes, trendRes] = await Promise.all([
          axios.get('/api/dashboard/attendance'),
          axios.get('/api/dashboard/timetable'),
          axios.get('/api/dashboard/subjects'),
          axios.get('/api/dashboard/attendance-trends')
        ]);
        setData({ attendance: attRes.data, timetable: timeRes.data, subjects: subRes.data, attendanceTrends: trendRes.data });
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-medium text-slate-500 dark:text-slate-400">Loading your dashboard...</div>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
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
                  {getGreeting()}, <span className="text-gradient-ai">{user?.name?.split(' ')[0] || 'Scholar'}</span>
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
            
            <AIAcademicInsights attendance={data.attendance} trends={data.attendanceTrends} />

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
        <Navbar />
        <main className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
          {renderContent()}
        </main>
      </div>
      {showFeedback && <FeedbackPanel onClose={() => setShowFeedback(false)} />}
    </div>
  );
};

export default Dashboard;
