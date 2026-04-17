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
      <div className="absolute inset-0 pointer-events-none z-0 bg-grid-pattern opacity-100"></div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto bg-transparent relative z-10 fade-in-up">
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
