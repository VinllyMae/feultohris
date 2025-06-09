"use client";

import { useState, useEffect } from 'react';
import { FaUserFriends, FaBriefcase, FaClipboardList, FaSignOutAlt, FaDashcube } from 'react-icons/fa';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import EmployeeList from '@/app/employees/page';
import JobList from './JobList';
import { ref, get } from 'firebase/database';
import { database } from '../../lib/firebase'; // adjust import path
import { getAuth, signOut } from 'firebase/auth';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#8884d8', '#82ca9d'];

export default function HRDashboardModal() {
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [employees, setEmployees] = useState({});
  const [jobs, setJobs] = useState({});
  const [applications, setApplications] = useState({});

  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const [errorEmployees, setErrorEmployees] = useState('');
  const [errorJobs, setErrorJobs] = useState('');
  const [errorApplications, setErrorApplications] = useState('');

  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [skillPerEmployeeData, setSkillPerEmployeeData] = useState([]); // NEW state
  const auth = getAuth();


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setErrorEmployees('');
    try {
      const snapshot = await get(ref(database, 'employees'));
      setEmployees(snapshot.val() || {});
    } catch {
      setErrorEmployees('Failed to load employees.');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchJobs = async () => {
    setLoadingJobs(true);
    setErrorJobs('');
    try {
      const snapshot = await get(ref(database, 'jobs'));
      console.log("JOBS", snapshot.val());
      setJobs(snapshot.val() || {});
    } catch {
      setErrorJobs('Failed to load jobs.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApplications(true);
    setErrorApplications('');
    try {
      const snapshot = await get(ref(database, 'applications'));
      setApplications(snapshot.val() || {});
    } catch {
      setErrorApplications('Failed to load applications.');
    } finally {
      setLoadingApplications(false);
    }
  };

  function computePieData(employees) {
    const genderSalaries = {};
    Object.values(employees).forEach(emp => {
      const gender = emp.gender || 'Unknown';
      const salary = parseFloat(emp.salaryGrade) || 0;
      genderSalaries[gender] = (genderSalaries[gender] || 0) + salary;
    });
    return Object.entries(genderSalaries).map(([name, value]) => ({ name, value }));
  }

  function computeBarData(employees) {
    const jobGenderCounts = {};
    Object.values(employees).forEach(emp => {
      const job = emp.position || 'Unknown';
      const gender = emp.gender || 'Unknown';
      if (!jobGenderCounts[job]) {
        jobGenderCounts[job] = { job };
      }
      jobGenderCounts[job][gender] = (jobGenderCounts[job][gender] || 0) + 1;
    });
    return Object.values(jobGenderCounts);
  }

  function computeSkillsPercentageByJob(employees) {
    const jobSkills = {};
    Object.values(employees).forEach(emp => {
      const job = emp.position || 'Unknown';
      const perc = emp.skillsPercentage || 0;
      if (!jobSkills[job]) {
        jobSkills[job] = { job, total: 0, count: 0 };
      }
      jobSkills[job].total += perc;
      jobSkills[job].count += 1;
    });

    return Object.values(jobSkills).map(({ job, total, count }) => ({
      job,
      skillsPercentage: count ? parseFloat((total / count).toFixed(1)) : 0,
    }));
  }

  // NEW: Compute individual employee skill % grouped by job
  function computeSkillMatchPerEmployee(employees) {
    const jobGroups = {};

    Object.values(employees).forEach(emp => {
      const job = emp.position || 'Unknown';
      if (!jobGroups[job]) jobGroups[job] = [];

      jobGroups[job].push({
        name: emp.name || 'Unnamed',
        skillsPercentage: emp.skillsPercentage || 0,
        job,
      });
    });

    // Flatten for BarChart
    return Object.entries(jobGroups).flatMap(([job, emps]) =>
      emps.map(emp => ({
        ...emp,
        groupLabel: `${job} (${emps.length})`,
      }))
    );
  }

  useEffect(() => {
    if (selectedPage === 'dashboard') {
      fetchEmployees();
      fetchJobs();
      fetchApplications();
    }
  }, [selectedPage]);

  useEffect(() => {
    if (!loadingEmployees && Object.keys(employees).length) {
      const pie = computePieData(employees);
      const bar = computeBarData(employees);
      const radar = computeSkillsPercentageByJob(employees);
      const skillPerEmployee = computeSkillMatchPerEmployee(employees);

      setPieData(pie);
      setBarData(bar);
      setRadarData(radar);
      setSkillPerEmployeeData(skillPerEmployee);
    }
  }, [loadingEmployees, employees]);

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
      <div className="w-60 bg-[#0f172a] text-white py-6 px-4 flex flex-col justify-between rounded-r-2xl">
        <div>
          <h2 className="text-xl font-semibold mb-4">HRIS</h2>
          <div className="space-y-4">
            <button
              className="flex items-center gap-3 hover:text-orange-400"
              onClick={() => setSelectedPage('dashboard')}
            >
              <FaDashcube className="w-4 h-4" /> <span>Dashboard</span>
            </button>

            <button className="flex items-center gap-3 hover:text-orange-400" onClick={handleEmployeesClick}>
              <FaUserFriends /> <span>Employees</span>
            </button>

            <button className="flex items-center gap-3 hover:text-orange-400" onClick={handleJobsClick}>
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
          <button
            className="flex items-center gap-3 hover:text-orange-400"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">{selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}</h1>
          <div className="text-sm text-gray-600">user@email.com | HR</div>
        </div>

        {selectedPage === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-white p-4 rounded shadow text-center">
                <div className="text-gray-500 text-sm">Total Employees</div>
                <div className="text-2xl font-bold">{Object.keys(employees).length}</div>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <div className="text-gray-500 text-sm">Total Applicants</div>
                <div className="text-2xl font-bold">{Object.keys(applications).length}</div>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <div className="text-gray-500 text-sm">Total Salary Grade</div>
                <div className="text-2xl font-bold">
                  ₱{
                    Object.values(employees).reduce((acc, curr) => acc + (parseFloat(curr.salaryGrade) || 0), 0).toLocaleString()
                  }
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <div className="text-gray-500 text-sm">Total Jobs Open</div>
                <div className="text-2xl font-bold">{Object.keys(jobs).length}</div>
              </div>
              <div className="bg-white p-4 rounded shadow text-center">
                <div className="text-gray-500 text-sm">Total Job Vacancies</div>
                <div className="text-2xl font-bold">
                  {Object.values(jobs).reduce((acc, job) => acc + (job.vacancies || 0), 0)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="mb-4 font-semibold">Salaries by Gender</h2>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No data available</p>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h2 className="mb-4 font-semibold">Hired Count by Gender per Job</h2>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={barData}>
                      <XAxis dataKey="job" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Male" stackId="a" fill="#36A2EB" />
                      <Bar dataKey="Female" stackId="a" fill="#FF6384" />
                      <Bar dataKey="LGBTQ" stackId="a" fill="#FFCE56" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No data available</p>
                )}
              </div>
            </div>

            {/* Skill Match Radar + New Grouped Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Skill Match per Job</h2>
              <p className="text-sm text-gray-500 mb-4">
                This chart visualizes how well employee skills match the required skills for each job.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#ccc" />
                    <PolarAngleAxis dataKey="job" tick={{ fill: '#555', fontSize: 12 }} />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fill: '#555' }}
                    />
                    <Radar
                      name="Skill Match %"
                      dataKey="skillsPercentage"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                  </RadarChart>
                </ResponsiveContainer>

                <div>
                  {skillPerEmployeeData.length > 0 ? (
                    <div>
                      <h3 className="font-light mb-2 text-gray-700">Employee Skill % by Job</h3>
                      {skillPerEmployeeData.length > 0 ? (
                        <div className="overflow-x-auto">
                          <div className="min-w-[2500px]"> {/* Adjust width as needed */}
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart
                                data={skillPerEmployeeData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
                              >
                                <XAxis
                                  dataKey="name"
                                  angle={-45}
                                  textAnchor="end"
                                  interval={0}
                                  height={80}
                                  tick={{ fontSize: 12 }}
                                />
                                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                <Tooltip formatter={(value) => `${value}%`} />
                                <Legend />
                                <Bar dataKey="skillsPercentage" fill="#82ca9d" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ) : (
                        <p>No skill data available</p>
                      )}
                    </div>

                  ) : (
                    <p>No skill data available</p>
                  )}
                </div>
              </div>

            </div>
          </>
        )}

        {selectedPage === 'employees' && <EmployeeList employees={employees} />}
        {selectedPage === 'jobs' && <JobList jobs={jobs} />}
        {selectedPage === 'logs' && (
          <div>
            <p>Logs page content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
