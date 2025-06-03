import { useState } from 'react';
import {ref, set, update, remove } from 'firebase/database';
import {database} from '../../lib/firebase'

export default function JobList({ jobs: initialJobs, onEdit, onDelete, onAdd }) {
  // Make a local copy to manage edits/deletes/adds inside this component
  const [jobs, setJobs] = useState(initialJobs || {});
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    salaryRange: '',
    skills: '',
  });

  const startEdit = (id) => {
    setEditingId(id);
    const job = jobs[id];
    setFormData({
      title: job.title,
      department: job.department,
      salaryRange: job.salaryRange,
      skills: job.skills?.join(', ') || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      department: '',
      salaryRange: '',
      skills: '',
    });
  };

  const saveEdit = async () => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    const updatedJob = {
      ...jobs[editingId],
      title: formData.title.trim(),
      department: formData.department.trim(),
      salaryRange: formData.salaryRange.trim(),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      // Update job in Firebase
      await update(ref(database, `jobs/${editingId}`), updatedJob);

      // Update local state
      const updatedJobs = { ...jobs, [editingId]: updatedJob };
      setJobs(updatedJobs);
      setEditingId(null);

      if (onEdit) onEdit(editingId, updatedJob);
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Error updating job. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;

    try {
      // Remove job from Firebase
      await remove(ref(database, `jobs/${id}`));

      // Update local state
      const updatedJobs = { ...jobs };
      delete updatedJobs[id];
      setJobs(updatedJobs);

      if (onDelete) onDelete(id);
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Error deleting job. Check console for details.');
    }
  };

  // Adding new job
  const [adding, setAdding] = useState(false);

  const startAdd = () => {
    setAdding(true);
    setFormData({
      title: '',
      department: '',
      salaryRange: '',
      skills: '',
    });
  };
  const saveAdd = async () => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    const id = `job_${Date.now()}`; // or use push() for unique ID in Realtime database

    const newJob = {
      title: formData.title.trim(),
      department: formData.department.trim(),
      salaryRange: formData.salaryRange.trim(),
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      applicants: [],
    };

    try {
      // Save new job in Firebase
      await set(ref(database, `jobs/${id}`), newJob);

      // Update local state
      const updatedJobs = { ...jobs, [id]: newJob };
      setJobs(updatedJobs);
      setAdding(false);

      if (onAdd) onAdd(id, newJob);
    } catch (error) {
      console.error('Failed to add job:', error);
      alert('Error adding job. Check console for details.');
    }
  };

  const cancelAdd = () => {
    setAdding(false);
    setFormData({
      title: '',
      department: '',
      salaryRange: '',
      skills: '',
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Jobs List</h3>
      <button
        onClick={startAdd}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={adding || editingId !== null}
      >
        + Add New Job
      </button>

      {adding && (
        <div className="border rounded p-4 mb-4 shadow bg-gray-50">
          <h4 className="text-md font-semibold mb-2">Add Job</h4>
          <JobForm formData={formData} setFormData={setFormData} />
          <div className="mt-2 space-x-2">
            <button
              onClick={saveAdd}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={cancelAdd}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {Object.keys(jobs).length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(jobs).map(([id, job]) => (
            <div
              key={id}
              className="border rounded p-4 shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              {editingId === id ? (
                <div className="flex-1">
                  <JobForm formData={formData} setFormData={setFormData} />
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      ID: <code>{id}</code>
                    </p>
                    <h4 className="text-xl font-semibold">{job.title}</h4>
                    <p className="text-gray-700">
                      Department: <span className="font-medium">{job.department}</span>
                    </p>
                    <p className="text-gray-700">
                      Salary Range: <span className="font-medium">₱{job.salaryRange}</span>
                    </p>
                    <p className="text-gray-700">
                      Skills: <span className="font-medium">{job.skills?.join(', ') || 'N/A'}</span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2 items-start md:items-end">
                    <p>
                      Applicants:{' '}
                      <span className="font-semibold">{Array.isArray(job.applicants) ? job.applicants.length : 0}</span>
                    </p>
                    <div className="space-x-2">
                      <button
                        onClick={() => startEdit(id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={adding}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        disabled={adding}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JobForm({ formData, setFormData }) {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Job Title"
        className="border rounded w-full px-3 py-2"
        value={formData.title}
        onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Department"
        className="border rounded w-full px-3 py-2"
        value={formData.department}
        onChange={(e) => setFormData((f) => ({ ...f, department: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Salary Range"
        className="border rounded w-full px-3 py-2"
        value={formData.salaryRange}
        onChange={(e) => setFormData((f) => ({ ...f, salaryRange: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Skills (comma separated)"
        className="border rounded w-full px-3 py-2"
        value={formData.skills}
        onChange={(e) => setFormData((f) => ({ ...f, skills: e.target.value }))}
      />
    </div>
  );
}
