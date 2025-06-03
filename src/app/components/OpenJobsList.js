'use client';

import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref as dbRef, onValue } from 'firebase/database';

export default function OpenJobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const jobsRef = dbRef(database, 'open_jobs');
    const unsubscribe = onValue(jobsRef, (snapshot) => {
      const jobsData = snapshot.val() || {};
      const jobsList = Object.entries(jobsData).map(([id, job]) => ({ id, ...job }));
      setJobs(jobsList);
    });

    return () => unsubscribe();
  }, []);

  if (jobs.length === 0) {
    return <p>No open jobs available at the moment.</p>;
  }

  return (
    <ul className="space-y-3">
      {jobs.map((job) => (
        <li key={job.id} className="border p-4 rounded shadow-sm">
          <h3 className="font-semibold text-xl">{job.title}</h3>
          <p>{job.description}</p>
          <p>
            <strong>Location:</strong> {job.location || 'N/A'}
          </p>
          <p>
            <strong>Posted on:</strong>{' '}
            {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}
          </p>
        </li>
      ))}
    </ul>
  );
}
