import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {user?.role === 'Admin' ? (
        <Route path="*" element={<AdminDashboard />} />
      ) : user?.role === 'Faculty' ? (
        <Route path="*" element={<FacultyDashboard />} />
      ) : (
        <Route path="*" element={<Dashboard />} />
      )}
    </Routes>
  );
}

export default App;
