'use client';

import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, get, update, set } from 'firebase/database';

const ALL_MODULES = ['Dashboard', 'Reports', 'User Management', 'Applications', 'Settings'];

export default function RoleManagementWithModules() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await get(ref(database, 'profiles'));
        const permsSnap = await get(ref(database, 'permissions'));

        if (usersSnap.exists()) {
          const userData = usersSnap.val();
          const usersList = Object.keys(userData).map((uid) => ({
            uid,
            ...userData[uid],
          }));
          setUsers(usersList);
        }

        if (permsSnap.exists()) {
          setPermissions(permsSnap.val());
        }
      } catch (err) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = (uid, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.uid === uid ? { ...user, role: newRole } : user
      )
    );
  };

  const handleModuleToggle = (role, module) => {
    setPermissions((prev) => {
      const current = prev[role] || [];
      const updated = current.includes(module)
        ? current.filter((m) => m !== module)
        : [...current, module];
      return { ...prev, [role]: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updates = {};
      users.forEach((user) => {
        updates[`profiles/${user.uid}/role`] = user.role;
      });
      updates[`permissions`] = permissions;

      await update(ref(database), updates);
      setSuccess('Roles and permissions updated!');
    } catch (err) {
      setError('Failed to update roles or permissions');
    } finally {
      setSaving(false);
    }
  };

  const uniqueRoles = [...new Set(users.map((u) => u.role))];

  return (
    <div className="mt-8 w-full max-w-5xl bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Role & Module Management</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="border-t">
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  <select
                    className="p-2 border rounded"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="Board Member">Board Member</option>
                    <option value="Applicant">Applicant</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4">Assign Modules to Roles</h3>
      {uniqueRoles.map((role) => (
        <div key={role} className="mb-6">
          <h4 className="font-semibold mb-2">{role}</h4>
          <div className="flex flex-wrap gap-4">
            {ALL_MODULES.map((mod) => (
              <label key={mod} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={permissions[role]?.includes(mod) || false}
                  onChange={() => handleModuleToggle(role, mod)}
                />
                <span>{mod}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
