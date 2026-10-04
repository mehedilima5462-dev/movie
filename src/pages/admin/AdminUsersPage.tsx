import React, { useState } from 'react';
import { Users, Shield, User, Search, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  joinedAt: string;
  favoritesCount: number;
}

export const AdminUsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUserRecord[]>([
    {
      id: 'usr-1',
      email: currentAdmin?.email || 'admin@moviehubbd.com',
      name: currentAdmin?.displayName || 'Administrator',
      role: 'admin',
      joinedAt: '2026-01-01',
      favoritesCount: 14
    },
    {
      id: 'usr-2',
      email: 'viewer.dhaka@gmail.com',
      name: 'Rahim Chowdhury',
      role: 'user',
      joinedAt: '2026-02-12',
      favoritesCount: 8
    },
    {
      id: 'usr-3',
      email: 'cinema.enthusiast@hotmail.com',
      name: 'Nusrat Jahan',
      role: 'user',
      joinedAt: '2026-02-28',
      favoritesCount: 22
    },
    {
      id: 'usr-4',
      email: 'mod.sylhet@moviehubbd.com',
      name: 'Farhan Kabir',
      role: 'admin',
      joinedAt: '2026-03-05',
      favoritesCount: 5
    }
  ]);

  const toggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newRole = u.role === 'admin' ? 'user' : 'admin';
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Users &amp; Role Management
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Audit registered members and assign administrative permissions.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-[#1c1c1c] border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      <div className="bg-[#141414] rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800 bg-neutral-900/60">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Saved Favorites</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold text-xs uppercase">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-neutral-400">{u.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {u.role === 'admin' && <Shield className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono">{u.joinedAt}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono">{u.favoritesCount}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => toggleRole(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 transition-colors"
                    >
                      {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
