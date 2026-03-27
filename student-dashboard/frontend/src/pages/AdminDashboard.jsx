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

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto bg-white/50 dark:bg-black/50 backdrop-blur-xl relative z-10">
        <Navbar />
        <main className="p-6 md:p-10 max-w-7xl mx-auto">
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
