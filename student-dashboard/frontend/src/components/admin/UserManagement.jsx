import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState({ id: null, full_name: '', email: '', role: 'Student' });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (activeUser.id) {
        await axios.put('/api/admin/users', activeUser);
      } else {
        await axios.post('/api/admin/users', activeUser);
      }
      setModalOpen(false);
      fetchUsers();
    } catch(err) { alert('Failed to save user'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently revoke this user's access?")) {
      try {
        await axios.delete('/api/admin/users', { data: { id } });
        fetchUsers();
      } catch(err) { alert('Failed to delete user'); }
    }
  };

  const filteredUsers = users.filter(u => 
    (filterRole === 'All' || u.role === filterRole) && 
    (u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div>Loading Records...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-6xl">
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Identity & Access Management</h2>
          <button onClick={() => { setActiveUser({ id: null, full_name: '', email: '', role: 'Student' }); setModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={18}/> Provision User
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search accounts by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48">
            <option value="All">All Roles</option>
            <option value="Student">Students Only</option>
            <option value="Faculty">Faculty Only</option>
            <option value="Admin">Administrators</option>
          </select>
        </div>

        {/* User Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">UID</th>
                <th className="px-6 py-4">Full Identity</th>
                <th className="px-6 py-4">Linked Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-mono text-slate-400 text-xs">#{u.id.toString().padStart(5, '0')}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{u.full_name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${u.role==='Admin'?'bg-rose-100 text-rose-700':u.role==='Faculty'?'bg-indigo-100 text-indigo-700':'bg-emerald-100 text-emerald-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button onClick={() => { setActiveUser(u); setModalOpen(true); }} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-slate-500">No users matched your query.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Engine */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{activeUser.id ? 'Modify Access Rights' : 'Provision New Identity'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input required type="text" value={activeUser.full_name} onChange={e=>setActiveUser({...activeUser, full_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input required type="email" value={activeUser.email} onChange={e=>setActiveUser({...activeUser, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Authorization Privilege (Role)</label>
                <select value={activeUser.role} onChange={e=>setActiveUser({...activeUser, role: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Student">Student Base Access</option>
                  <option value="Faculty">Faculty Operations</option>
                  <option value="Admin">Administrator Override</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4 mt-8 border-t border-slate-100">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition">Save Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default UserManagement;
