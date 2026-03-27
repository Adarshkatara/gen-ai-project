import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, FileText, User, FileBarChart, Users, MessageSquare, CreditCard, BookOpen, MonitorPlay, MessageCircle, Bell, Clock, Building, CheckSquare, Edit3, Folder, Send, Award, Calendar, FolderOpen } from 'lucide-react';

const Sidebar = ({ activeTab = 'Dashboard', setActiveTab = () => {} }) => {
  const { user } = useContext(AuthContext);

  const studentItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Registration', icon: FileText },
    { label: 'Main Account', icon: User },
    { label: 'Policies', icon: FileBarChart },
    { label: 'My Advisor', icon: Users },
    { label: 'Academic Feedbacks', icon: MessageSquare },
    { label: 'Fee Details', icon: CreditCard },
    { label: 'Value Added Course', icon: BookOpen },
    { label: 'Online Class', icon: MonitorPlay },
    { label: 'Feedback Panel', icon: MessageCircle },
    { label: 'Notifications', icon: Bell },
    { label: 'Exam Section', icon: Clock },
    { label: 'Hostel/Mess/Transport', icon: Building },
  ];

  const facultyItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Attendance', icon: CheckSquare },
    { label: 'Assignments', icon: FileText },
    { label: 'Marks', icon: Edit3 },
    { label: 'Students', icon: Users },
    { label: 'Materials', icon: Folder },
    { label: 'Messages', icon: Send }
  ];

  const adminItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Users', icon: Users },
    { label: 'Courses', icon: BookOpen },
    { label: 'Attendance', icon: CheckSquare },
    { label: 'Results', icon: Award },
    { label: 'Timetable', icon: Calendar },
    { label: 'Fees', icon: CreditCard },
    { label: 'Announcements', icon: Send },
    { label: 'Documents', icon: FolderOpen },
    { label: 'Activity Logs', icon: FileBarChart }
  ];

  const isFaculty = user?.role === 'Faculty';
  const isAdmin = user?.role === 'Admin';
  
  const menuItems = isAdmin ? adminItems : isFaculty ? facultyItems : studentItems;

  return (
    <aside className={`w-64 flex-shrink-0 h-screen overflow-y-auto hidden md:block sticky top-0 custom-scrollbar z-50 ${isFaculty ? 'bg-black text-rose-100/70 border-r border-red-900/30' : 'bg-slate-900 text-slate-300 border-r border-slate-800'}`}>
      <div className="h-16 flex items-center px-6 border-b border-opacity-20 border-white">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <div className={isAdmin ? 'bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20' : isFaculty ? 'bg-gradient-to-br from-red-600 to-rose-600 p-1.5 rounded-lg shadow-lg shadow-red-500/20' : 'bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20'}><LayoutDashboard size={20} className="text-white" /></div>
          NEXUS Edu
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = activeTab === item.label;
            return (
              <li key={index}>
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveTab(item.label); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm group ${isActive ? (isAdmin ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50 scale-[1.02]' : isFaculty ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50 scale-[1.02]' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-900/50 scale-[1.02]') : (isFaculty ? 'hover:bg-zinc-900 hover:text-white' : 'hover:bg-slate-800 hover:text-white')}`}
                >
                  <item.icon size={18} className={`${isActive ? 'text-white' : (isAdmin ? 'text-slate-400 group-hover:text-blue-400' : isFaculty ? 'text-rose-400 group-hover:text-red-400' : 'text-slate-400 group-hover:text-indigo-400')} transition-colors`} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
