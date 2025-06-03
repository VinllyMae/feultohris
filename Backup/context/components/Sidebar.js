'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeLink, setActiveLink] = useState('dashboard'); // Track active link

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Ensure Sidebar is only rendered client-side
  }

  const handleLinkClick = (link) => {
    setActiveLink(link); // Update active link on click
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-6 fixed h-full">
      <ul>
        {/* Dashboard Link */}
        <div
          className={`flex items-center mb-6 ${activeLink === 'dashboard' ? 'bg-blue-500' : ''}  `}
          onClick={() => handleLinkClick('dashboard')}
        >
          {/* Left Bar (Flag) */}
          <span
            className={`w-2 h-8 ${activeLink === 'dashboard' ? 'bg-white' : 'bg-gray-800'} mr-4`}
          ></span>
          {/* Text on the right */}
          <Link href="#dashboard" className="text-xl text-white hover:text-gray-400 w-full">
            Dashboard
          </Link>
        </div>

        {/* Job Applications Link */}
        <div
          className={`flex items-center mb-6 ${activeLink === 'job-applications' ? 'bg-blue-500' : ''}  `}
          onClick={() => handleLinkClick('job-applications')}
        >
          {/* Left Bar (Flag) */}
          <span
            className={`w-2 h-8 ${activeLink === 'job-applications' ? 'bg-white' : 'bg-gray-800'} mr-4`}
          ></span>
          {/* Text on the right */}
          <Link href="#job-applications" className="text-xl text-white hover:text-gray-400 w-full">
            Job Applications
          </Link>
        </div>

        {/* Calendar Link */}
        <div
          className={`flex items-center mb-6 ${activeLink === 'calendar' ? 'bg-blue-500' : ''}  `}
          onClick={() => handleLinkClick('calendar')}
        >
          {/* Left Bar (Flag) */}
          <span
            className={`w-2 h-8 ${activeLink === 'calendar' ? 'bg-white' : 'bg-gray-800'} mr-4`}
          ></span>
          {/* Text on the right */}
          <Link href="#calendar" className="text-xl text-white hover:text-gray-400 w-full">
            Calendar
          </Link>
        </div>

        {/* Requests Link */}
        <div
          className={`flex items-center mb-6 ${activeLink === 'requests' ? 'bg-blue-500' : ''}  `}
          onClick={() => handleLinkClick('requests')}
        >
          {/* Left Bar (Flag) */}
          <span
            className={`w-2 h-8 ${activeLink === 'requests' ? 'bg-white' : 'bg-gray-800'} mr-4`}
          ></span>
          {/* Text on the right */}
          <Link href="#requests" className="text-xl text-white hover:text-gray-400 w-full">
            Requests
          </Link>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
