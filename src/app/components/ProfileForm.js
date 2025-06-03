import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../lib/firebase';

export default function ProfileForm({ userId, profile }) {
  const [email, setEmail] = useState(profile.email || '');
  const [contact, setContact] = useState(profile.contact || '');

  const handleUpdate = async () => {
    await update(ref(database, 'profiles/' + userId), {
      email,
      contact
    });
    alert('Profile updated!');
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
      <label className="block mb-2">
        Email:
        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" />
      </label>
      <label className="block mb-2">
        Contact Number:
        <input value={contact} onChange={e => setContact(e.target.value)} className="w-full border p-2 rounded" />
      </label>
      <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700">Save</button>
    </div>
  );
}
