'use client';

import { useState, useEffect } from 'react';

export default function JobForm({ onSubmit, onCancel, job }) {
  const [hasMounted, setHasMounted] = useState(false);

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (job) {
      setTitle(job.title || '');
      setDepartment(job.department || '');
      setSalaryRange(job.salaryRange || '');
      setSkills(job.skills || []);
    } else {
      setTitle('');
      setDepartment('');
      setSalaryRange('');
      setSkills([]);
    }
    setSkillInput('');
  }, [job]);

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jobData = {
      title,
      department,
      salaryRange,
      skills,
    };

    onSubmit(jobData, job?.id);
  };

  // Don't render form until mounted on client
  if (!hasMounted) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-2">{job ? 'Edit Job' : 'Add New Job'}</h2>

      <div className="mb-2">
        <label className="block text-sm font-medium">Job Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Salary Range</label>
        <input
          type="text"
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Skills Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Skills (press Enter or comma to add)</label>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill"
          className="w-full border p-2 rounded mb-2"
        />
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full cursor-pointer select-none"
              onClick={() => handleRemoveSkill(skill)}
              title="Click to remove"
            >
              {skill} ×
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {job ? 'Update Job' : 'Create Job'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
