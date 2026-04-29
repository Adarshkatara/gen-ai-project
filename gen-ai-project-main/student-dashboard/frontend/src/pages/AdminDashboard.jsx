import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import CourseManagement from '../components/admin/CourseManagement';
import GlobalAttendance from '../components/admin/GlobalAttendance';
import ResultsApproval from '../components/admin/ResultsApproval';
import TimetableBuilder from '../components/admin/TimetableBuilder';
import FeeManagement from '../components/admin/FeeManagement';
import BroadcastSystem from '../components/admin/BroadcastSystem';
import DocumentManager from '../components/admin/DocumentManager';
import ActivityAuditor from '../components/admin/ActivityAuditor';

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 dark:bg-[#1C1917] relative">
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-100"></div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto bg-transparent relative z-10">
        <Navbar />
        <main className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
          {/* Welcome Header Section */}
          <div className="mb-8 p-6 bg-white dark:bg-[#292524] rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 hover:shadow-md">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">
                Welcome back, {user?.name || 'Administrator'}! 👋
              </h1>
              <p className="text-stone-500 dark:text-stone-400">
                Here's an overview of what's happening in your institution today.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <span className="w-2 h-2 mr-2 bg-emerald-500 rounded-full animate-pulse"></span>
                System Online
              </span>
            </div>
          </div>

          {activeTab === 'Dashboard' && <AdminOverview setActiveTab={setActiveTab} />}
          {activeTab === 'Users' && <UserManagement />}
          {activeTab === 'Courses' && <CourseManagement />}
          {activeTab === 'Attendance' && <GlobalAttendance />}
          {activeTab === 'Results' && <ResultsApproval />}
          {activeTab === 'Timetable' && <TimetableBuilder />}
          {activeTab === 'Fees' && <FeeManagement />}
          {activeTab === 'Announcements' && <BroadcastSystem />}
          {activeTab === 'Documents' && <DocumentManager />}
          {activeTab === 'Activity Logs' && <ActivityAuditor />}
        </main>
      </div>
    </div>
  );
};
export default AdminDashboard;
