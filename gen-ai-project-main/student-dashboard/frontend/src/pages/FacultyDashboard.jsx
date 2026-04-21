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

const FacultyDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-black relative">
      {/* Background glowing orbs for premium feel */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[130px] pointer-events-none z-0 animate-pulse mix-blend-screen" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[60%] rounded-full bg-pink-900/10 blur-[120px] pointer-events-none z-0 animate-pulse mix-blend-screen" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-100"></div>
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto bg-transparent relative z-10 fade-in-up transition-all duration-700">
        <Navbar />
        <main className="p-6 md:p-10 max-w-7xl mx-auto flex-1 animate-fade-in-up">
          {activeTab === 'Dashboard' && <FacultyOverview setActiveTab={setActiveTab} />}
          {activeTab === 'Attendance' && <AttendanceMarking />}
          {activeTab === 'Assignments' && <AssignmentManager />}
          {activeTab === 'Marks' && <MarksEntry />}
          {activeTab === 'Students' && <StudentDirectory />}
          {activeTab === 'Materials' && <StudyMaterials />}
          {activeTab === 'Messages' && <Announcements />}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
