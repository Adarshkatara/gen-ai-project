import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, FileText, User, FileBarChart, Users, MessageSquare, CreditCard, BookOpen, MonitorPlay, MessageCircle, Bell, Clock, Building, CheckSquare, Edit3, Folder, Send, Award, Calendar, FolderOpen, Sparkles } from 'lucide-react';

const Sidebar = ({ activeTab = 'Dashboard', setActiveTab = () => {} }) => {
  const { user } = useContext(AuthContext);

  const studentItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'AI Copilot', icon: Sparkles },
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
    { label: 'AI Analysis', icon: Sparkles },
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
    <aside className="w-64 flex-shrink-0 h-screen overflow-y-auto hidden md:block sticky top-0 custom-scrollbar z-50 bg-slate-50 dark:bg-[#09090b] border-r border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl tracking-wide">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm shadow-indigo-500/20">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          NEXUS Edu
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">Main Menu</p>
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => {
            const isActive = activeTab === item.label;
            return (
              <li key={index}>
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveTab(item.label); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm group ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm' 
                      : 'hover:bg-white dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:shadow-sm'
                  }`}
                >
                  <item.icon size={18} className={`${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                  } transition-colors duration-300`} />
                  {item.label}
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full animate-fade-in-up" />}
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
