import { Routes, Route } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoleSwitcher from './components/admin/AdminRoleSwitcher';

function App() {
  const auth = useContext(AuthContext);
  const [adminViewMode, setAdminViewMode] = useState('Admin'); // Admin simulator state

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Intercept the visual role if the user is an Administrator using the Switcher
  const effectiveRole = auth.user?.role === 'Admin' ? adminViewMode : auth.user?.role;
  const effectiveUser = auth.user ? { ...auth.user, role: effectiveRole } : null;

  return (
    <AuthContext.Provider value={{ ...auth, user: effectiveUser }}>
      <Routes>
        {effectiveRole === 'Admin' ? (
          <Route path="*" element={<AdminDashboard />} />
        ) : effectiveRole === 'Faculty' ? (
          <Route path="*" element={<FacultyDashboard />} />
        ) : (
          <Route path="*" element={<Dashboard />} />
        )}
      </Routes>

      {/* Expose privilege switcher node exclusively to Master Admins */}
      {auth.user?.role === 'Admin' && (
        <AdminRoleSwitcher currentMode={adminViewMode} setMode={setAdminViewMode} />
      )}
    </AuthContext.Provider>
  );
}
s
export default App;
