import { useState, useEffect } from 'react';
import { ref as dbRef, get } from 'firebase/database';
import { database } from '../lib/firebase'; // adjust path as needed

export default function ActivityLogs({ userId }) {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setActivityLogs([]);
      setLoading(false);
      return;
    }

    const logsRef = dbRef(database, `profiles/${userId}/activityLogs`);

    get(logsRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const logs = snapshot.val();
          const logsArray = Object.entries(logs)
            .map(([id, log]) => ({ id, ...log }))
            // Sort by appliedAt timestamp descending (newest first)
            .sort((a, b) => b.appliedAt - a.appliedAt);
          setActivityLogs(logsArray);
        } else {
          setActivityLogs([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setActivityLogs([]);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading activity logs...</p>;

  return (
    <div className="bg-white p-4 rounded shadow max-h-64 overflow-auto">
      <h2 className="text-xl font-semibold mb-2">Activity Logs</h2>
      {activityLogs.length === 0 ? (
        <p>No activity logs found.</p>
      ) : (
        <ul className="space-y-2">
          {activityLogs.map(({ id, jobTitle, appliedAt }) => (
            <li key={id} className="border-b pb-1">
              <strong>{jobTitle}</strong> — applied on{' '}
              {new Date(appliedAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
