'use client';

import { useState } from 'react';
import { FaUserFriends, FaBriefcase, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import EmployeeList from '@/app/EmployeeList/EmployeeList';
import JobList from './JobList'
import { ref, get, remove } from 'firebase/database';
import { database } from '../../lib/firebase'; // adjust import path


const pieData = [
  { name: 'Female', value: 500000 },
  { name: 'Male', value: 600000 },
  { name: 'LGBTQ', value: 300000 },
];
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56'];

const barData = [
  { job: 'Developer', Female: 4, Male: 6, LGBTQ: 2 },
  { job: 'Designer', Female: 3, Male: 2, LGBTQ: 1 },
  { job: 'Manager', Female: 2, Male: 5, LGBTQ: 0 },
];

const skillMatchJobData = [
  { job: 'Developer', skillMatchPercent: 80, hiredCount: 1 },
  { job: 'Developer', skillMatchPercent: 50, hiredCount: 2 },
  { job: 'Designer', skillMatchPercent: 70, hiredCount: 1 },
  { job: 'Designer', skillMatchPercent: 50, hiredCount: 1 },
  { job: 'Manager', skillMatchPercent: 90, hiredCount: 1 },
  { job: 'Manager', skillMatchPercent: 60, hiredCount: 1 },
  { job: 'QA', skillMatchPercent: 80, hiredCount: 1 },
  { job: 'QA', skillMatchPercent: 50, hiredCount: 1 },
  { job: 'HR', skillMatchPercent: 70, hiredCount: 1 },
  { job: 'HR', skillMatchPercent: 40, hiredCount: 1 },
];

// Transform data for grouped bar chart
function transformSkillMatchData(data) {
  // Collect unique skillMatchPercent values as keys
  const skillKeys = Array.from(new Set(data.map(d => d.skillMatchPercent))).sort((a, b) => b - a);

  // Group by job, and map skillMatchPercent to hiredCount
  const jobs = Array.from(new Set(data.map(d => d.job)));

  const result = jobs.map(job => {
    const filtered = data.filter(d => d.job === job);
    const obj = { job };
    skillKeys.forEach(key => {
      const found = filtered.find(d => d.skillMatchPercent === key);
      obj[`${key}%`] = found ? found.hiredCount : 0;
    });
    return obj;
  });

  return { result, skillKeys: skillKeys.map(k => `${k}%`) };
}

const { result: groupedData, skillKeys } = transformSkillMatchData(skillMatchJobData);



export default function HRDashboardModal() {
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [employees, setEmployees] = useState({});
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errorEmployees, setErrorEmployees] = useState('');

  // Jobs state
  const [jobs, setJobs] = useState({});
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [errorJobs, setErrorJobs] = useState('');
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setErrorEmployees('');
    try {
      const snapshot = await get(ref(database, 'employees'));
      setEmployees(snapshot.val() || {});
    } catch (error) {
      setErrorEmployees('Failed to load employees.');
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch jobs from Firebase
  const fetchJobs = async () => {
    setLoadingJobs(true);
    setErrorJobs('');
    try {
      const snapshot = await get(ref(database, 'jobs'));
      setJobs(snapshot.val() || {});
    } catch (error) {
      setErrorJobs('Failed to load jobs.');
    } finally {
      setLoadingJobs(false);
    }
  };
  // Handle sidebar click for employees
  const handleEmployeesClick = () => {
    setSelectedPage('employees');
    fetchEmployees();
  };

  const handleJobsClick = () => {
    setSelectedPage('jobs');
    fetchJobs();
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-60 bg-[#0f172a] text-white py-6 px-4 flex flex-col justify-between rounded-r-2xl">
        <div>
          <h2 className="text-xl font-semibold mb-8">Mboard</h2>
          <div className="space-y-4">
            <button
              className="flex items-center gap-3 hover:text-orange-400"
              onClick={handleEmployeesClick}
            >
              <FaUserFriends /> <span>Employees</span>
            </button>

            <button
              className="flex items-center gap-3 hover:text-orange-400"
              onClick={handleJobsClick}
            >
              <FaBriefcase /> <span>Jobs</span>
            </button>
            <button
              className="flex items-center gap-3 hover:text-orange-400"
              onClick={() => setSelectedPage('logs')}
            >
              <FaClipboardList /> <span>Logs</span>
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <button className="flex items-center gap-3 hover:text-orange-400">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </div>
      <div className="flex-1 p-6">
        {/* Top nav */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">
            {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}
          </h1>
          <div className="text-sm text-gray-600">user@email.com | HR</div>
        </div>

        {/* Render page content */}
        {selectedPage === 'dashboard' && (
          <>
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              {/* Top nav */}
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div className="text-sm text-gray-600">user@email.com | HR</div>
              </div>

              {/* Boards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow text-center">
                  <div className="text-gray-500 text-sm">Total Employees</div>
                  <div className="text-2xl font-bold">50</div>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                  <div className="text-gray-500 text-sm">Total Applicants</div>
                  <div className="text-2xl font-bold">120</div>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                  <div className="text-gray-500 text-sm">Total Salary</div>
                  <div className="text-2xl font-bold">₱1,400,000</div>
                </div>
                <div className="bg-white p-4 rounded shadow text-center">
                  <div className="text-gray-500 text-sm">Job Offer Amount</div>
                  <div className="text-2xl font-bold">₱600,000</div>
                </div>
              </div>

              {/* Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Hired Employees by Gender per Job Position */}
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="text-lg font-semibold mb-4">Orders Analytics</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <XAxis dataKey="job" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Female" fill="#FF6384" />
                      <Bar dataKey="Male" fill="#36A2EB" />
                      <Bar dataKey="LGBTQ" fill="#FFCE56" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Salary by Gender */}
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="text-lg font-semibold mb-4">Salary by Gender</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skill Match % Distribution */}
              <div className="bg-white p-4 rounded shadow ">
                <h2 className="text-lg font-semibold mb-4">Hired Employees Skill Match % by Job</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
                    <XAxis dataKey="job" />
                    <YAxis allowDecimals={false} label={{ value: 'Hired Count', angle: -90, position: 'insideLeft', offset: 10 }} />
                    <Tooltip />
                    <Legend />
                    {skillKeys.map((key, index) => (
                      <Bar key={key} dataKey={key} name={`Skill Match ${key}`} stackId="a" fill={COLORS[index % COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

          </>
        )}

        {selectedPage === 'employees' && (
          <div>
            {loadingEmployees && <p>Loading employees...</p>}
            {errorEmployees && <p className="text-red-600">{errorEmployees}</p>}
            {!loadingEmployees && !errorEmployees && (
              <EmployeeList
                employees={employees}
                onEdit={(id) => alert(`Edit employee ${id}`)}
                onDelete={async (id) => {
                  if (confirm('Are you sure you want to delete this employee?')) {
                    await remove(ref(database, `employees/${id}`));
                    // Refresh employees list after deletion
                    fetchEmployees();
                  }
                }}
              />
            )}
          </div>
        )}

        {selectedPage === 'jobs' && (
          <div>
            {loadingJobs && <p>Loading jobs...</p>}
            {errorJobs && <p className="text-red-600">{errorJobs}</p>}
            {!loadingJobs && !errorJobs && (
              <JobList
                jobs={jobs}
                onEdit={(id) => alert(`Edit job ${id}`)}
                onDelete={async (id) => {
                  if (confirm('Are you sure you want to delete this job?')) {
                    await remove(ref(database, `jobs/${id}`));
                    fetchJobs();
                  }
                }}
              />
            )}
          </div>
        )}

        {selectedPage === 'logs' && (
          <div>
            <h2 className="text-lg font-semibold">Logs Page</h2>
            {/* TODO: Add logs page content */}
          </div>
        )}
      </div>


    </div>
  );
}
