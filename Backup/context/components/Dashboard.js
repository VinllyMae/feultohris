'use client';

import { useState } from 'react';

const Dashboard = () => {
  const [employeeData] = useState({
    totalEmployees: 100,
    workFromHome: 45,
    daysOff: 20,
    vacation: 15,
    sickLeave: 10,
  });

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4">
      {/* 1st Column (2 Rows) - Wider for Total Employees */}
      <div className="col-span-2 row-span-2 px-4 py-2 border border-gray-300 bg-blue-500 flex flex-col justify-center items-center">
        <h3 className="text-xs font-semibold mb-2 text-white">Total Employees</h3> {/* Smaller Title */}
        <p className="text-2xl font-bold text-white">{employeeData.totalEmployees}</p> {/* Centered White Number */}
      </div>

      {/* 2nd Column */}
      <div className="px-4 py-2 border border-gray-300 flex flex-col justify-center items-center">
        <h3 className="text-xs font-semibold mb-2">Work From Home</h3> {/* Smaller Title */}
        <p className="text-2xl font-bold">{employeeData.workFromHome}</p>
      </div>

      <div className="px-4 py-2 border border-gray-300 flex flex-col justify-center items-center">
        <h3 className="text-xs font-semibold mb-2">Days Off</h3> {/* Smaller Title */}
        <p className="text-2xl font-bold">{employeeData.daysOff}</p>
      </div>

      {/* 3rd Column */}
      <div className="px-4 py-2 border border-gray-300 flex flex-col justify-center items-center">
        <h3 className="text-xs font-semibold mb-2">On Vacation</h3> {/* Smaller Title */}
        <p className="text-2xl font-bold">{employeeData.vacation}</p>
      </div>

      <div className="px-4 py-2 border border-gray-300 flex flex-col justify-center items-center">
        <h3 className="text-xs font-semibold mb-2">On Sick Leave</h3> {/* Smaller Title */}
        <p className="text-2xl font-bold">{employeeData.sickLeave}</p>
      </div>
    </div>
  );
};

export default Dashboard;
