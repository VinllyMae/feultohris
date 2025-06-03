'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, role);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded w-80">
        <h2 className="text-2xl mb-4 font-bold">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="mb-4 p-2 border rounded w-full"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
