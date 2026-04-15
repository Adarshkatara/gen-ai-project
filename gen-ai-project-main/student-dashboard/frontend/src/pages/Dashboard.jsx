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

import { FeeDetailsTab, RegistrationTab, ExamSectionTab, AccountManagerTab, PoliciesViewerTab, AdvisorConnectTab, OnlineClassTab, FacilitiesTab, ValueAddedProgramsTab, AcademicFeedbacksTab, NotificationsTab } from '../components/student/StudentInteractiveTabs';

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
      case 'Dashboard':
      default:
        return (
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Academic Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Welcome back, {user?.name}. Here is an overview of your current academic progress.</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowFeedback(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 shadow-sm transition-all focus:ring-4 focus:ring-indigo-500/20">
                <MessageCircle size={18} /> Help & Support
              </motion.button>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}><AttendanceChart data={data.attendanceTrends} /></motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2 space-y-8">
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
