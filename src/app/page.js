'use client';

import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { ref, set, get, serverTimestamp } from 'firebase/database';
import { auth, database } from './lib/firebase';
import RoleManagement from './components/RoleManagement';
import ApplicantDashboard from './components/ApplicantDashboard';
import HRDashboard from './components/HRDashboard/HRDashboard';

export default function Home() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Admin');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    setLoadingProfile(true);
    try {
      const snapshot = await get(ref(database, `profiles/${uid}`));
      if (snapshot.exists()) {
        setProfile(snapshot.val());
      } else {
        setProfile(null);
        setError('No profile data found.');
      }
    } catch (err) {
      setError('Failed to load user profile.');
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, `profiles/${user.uid}`), {
        email,
        username,
        role,
        createdAt: serverTimestamp(),
      });

      setEmail('');
      setPassword('');
      setUsername('');
      setRole('Admin');

      alert('Registration successful! Please log in.');
      setIsRegistering(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      await fetchUserProfile(userCredential.user.uid);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProfile(null);
    setUser(null);
  };

  if (user && loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading your profile...</p>
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Main content fills remaining space */}
        <main className="flex-grow overflow-auto">
          {profile.role === 'Admin' && <RoleManagement />}
          {profile.role === 'Applicant' && <ApplicantDashboard user={user} profile={profile} />}
          {profile.role === 'HR' && <HRDashboard user={user} profile={profile} />}
        </main>
      </div>
    );
  }

  // Default: login/register form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        {isRegistering ? 'Register' : 'Login'}
      </h1>

      <div className="bg-white p-6 sm:p-8 rounded shadow-md w-full max-w-xs sm:max-w-md space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <select
              className="w-full p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Admin</option>
              <option>HR</option>
              <option>Board Member</option>
              <option>Applicant</option>
            </select>
          </>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={isRegistering ? handleRegister : handleLogin}
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>

        <p
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
          className="text-sm text-blue-600 cursor-pointer hover:underline text-center"
        >
          {isRegistering
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}
