// components/JobApplications.js
'use client';

import { useState } from 'react';
const JobApplications = () => {
  const [applications] = useState([
    { id: 1, name: 'John Doe', role: 'Software Engineer' },
    { id: 2, name: 'Jane Smith', role: 'HR Manager' },
    { id: 3, name: 'Alice Johnson', role: 'Accountant' },
    { id: 4, name: 'Bob Brown', role: 'Software Engineer' },
    { id: 5, name: 'Sara Lee', role: 'Project Manager' },
    { id: 6, name: 'Tom Green', role: 'HR Specialist' },
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {applications.map((application) => (
        <div
          key={application.id}
          className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
        >
          {/* Circle Profile Picture */}
          <div className="flex-shrink-0">
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={`/Images/Img${application.id}.png`} // Updated image path
              alt={application.name}
            />
          </div>
          {/* Name and Role */}
          <div>
            <h3 className="text-xl font-semibold">{application.name}</h3>
            <p className="text-sm text-gray-500">{application.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobApplications;
