import { useState, useEffect } from 'react';
import { ref, set, update, remove } from 'firebase/database';
import { database } from '../../lib/firebase';
import {
  Briefcase, Building2, Coins, Wrench, Users, X
} from 'lucide-react';
import Modal from "./Modal"
export default function JobList({ jobs: initialJobs, onEdit, onDelete, onAdd }) {
  const [jobs, setJobs] = useState(initialJobs || {});
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    office: '',
    level: '',
    annualSalaryActual: '',
    annualSalaryAuthorized: '',
    areaCode: '',
    areaType: '',
    itemNumber: '',
    plantillaPosition: '',
    ppaAttribution: '',
    requiredSkills: '',
    salaryGrade: '',
    step: '',
    vacancies: '',
    applicants: []
  });
  const [modalJob, setModalJob] = useState(null);
  const [adding, setAdding] = useState(false);
  const [applicantDetails, setApplicantDetails] = useState([]);

  useEffect(() => {
    if (adding) resetForm();
  }, [adding]);

  useEffect(() => {
    if (!modalJob || !modalJob.applicants) {
      setApplicantDetails([]);
      return;
    }

    // If applicants are stored as an object
    const details = Object.entries(modalJob.applicants).map(([id, data]) => ({
      id,
      ...data
    }));
    setApplicantDetails(details);
  }, [modalJob]);

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      jobDescription: '',
      office: '',
      level: '',
      annualSalaryActual: '',
      annualSalaryAuthorized: '',
      areaCode: '',
      areaType: '',
      itemNumber: '',
      plantillaPosition: '',
      ppaAttribution: '',
      requiredSkills: '',
      salaryGrade: '',
      step: '',
      vacancies: '',
      applicants: []
    });
  };

  const startEdit = (id) => {
    setEditingId(id);
    setAdding(false);
    const job = jobs[id];
    setFormData({
      jobTitle: job.jobTitle || '',
      jobDescription: job.jobDescription || '',
      office: job.office || '',
      level: job.level || '',
      annualSalaryActual: job.annualSalaryActual || '',
      annualSalaryAuthorized: job.annualSalaryAuthorized || '',
      areaCode: job.areaCode || '',
      areaType: job.areaType || '',
      itemNumber: job.itemNumber || '',
      plantillaPosition: job.plantillaPosition || '',
      ppaAttribution: job.ppaAttribution || '',
      requiredSkills: (job.requiredSkills || []).join(', '),
      salaryGrade: job.salaryGrade || '',
      step: job.step || '',
      vacancies: job.vacancies || '',
      applicants: job.applicants || []
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const saveEdit = async () => {
    if (!formData.jobTitle.trim()) {
      alert('Job Title is required');
      return;
    }

    const updatedJob = {
      ...jobs[editingId],
      jobTitle: formData.jobTitle.trim(),
      jobDescription: formData.jobDescription.trim(),
      office: formData.office.trim(),
      level: formData.level.trim(),
      annualSalaryActual: Number(formData.annualSalaryActual),
      annualSalaryAuthorized: Number(formData.annualSalaryAuthorized),
      areaCode: formData.areaCode.trim(),
      areaType: formData.areaType.trim(),
      itemNumber: formData.itemNumber.trim(),
      plantillaPosition: formData.plantillaPosition.trim(),
      ppaAttribution: formData.ppaAttribution.trim(),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      salaryGrade: Number(formData.salaryGrade),
      step: Number(formData.step),
      vacancies: Number(formData.vacancies),
      applicants: formData.applicants
    };

    try {
      await update(ref(database, `jobs/${editingId}`), updatedJob);
      setJobs({ ...jobs, [editingId]: updatedJob });
      setEditingId(null);
      if (onEdit) onEdit(editingId, updatedJob);
      resetForm();
    } catch (error) {
      console.error('Failed to update job:', error);
      alert('Error updating job. Check console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await remove(ref(database, `jobs/${id}`));
      const updatedJobs = { ...jobs };
      delete updatedJobs[id];
      setJobs(updatedJobs);
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Error deleting job. Check console for details.');
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    resetForm();
  };

  const saveAdd = async () => {
    if (!formData.jobTitle.trim()) {
      alert('Job Title is required');
      return;
    }

    const id = `job_${Date.now()}`;
    const newJob = {
      jobTitle: formData.jobTitle.trim(),
      jobDescription: formData.jobDescription.trim(),
      office: formData.office.trim(),
      level: formData.level.trim(),
      annualSalaryActual: Number(formData.annualSalaryActual),
      annualSalaryAuthorized: Number(formData.annualSalaryAuthorized),
      areaCode: formData.areaCode.trim(),
      areaType: formData.areaType.trim(),
      itemNumber: formData.itemNumber.trim(),
      plantillaPosition: formData.plantillaPosition.trim(),
      ppaAttribution: formData.ppaAttribution.trim(),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      salaryGrade: Number(formData.salaryGrade),
      step: Number(formData.step),
      vacancies: Number(formData.vacancies),
      applicants: []
    };

    try {
      await set(ref(database, `jobs/${id}`), newJob);
      setJobs({ ...jobs, [id]: newJob });
      setAdding(false);
      if (onAdd) onAdd(id, newJob);
      resetForm();
    } catch (error) {
      console.error('Failed to add job:', error);
      alert('Error adding job. Check console for details.');
    }
  };

  const cancelAdd = () => {
    setAdding(false);
    resetForm();
  };

  const openModal = (job) => setModalJob(job);
  const closeModal = () => setModalJob(null);

  return (
<div className="max-h-[80vh] overflow-y-auto p-1">
      <button
        onClick={startAdd}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={adding || editingId !== null}
      >
        + Add New Job
      </button>

      {(adding || editingId) && (
        <div className="border rounded p-4 mb-4 shadow bg-gray-50">
          <h4 className="text-md font-semibold mb-2">{adding ? 'Add Job' : 'Edit Job'}</h4>
          <JobForm formData={formData} setFormData={setFormData} />
          <div className="mt-2 space-x-2">
            {adding ? (
              <>
                <button onClick={saveAdd} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                <button onClick={cancelAdd} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={saveEdit} className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700">Save</button>
                <button onClick={cancelEdit} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {Object.keys(jobs).length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(jobs).map(([id, job]) => (
            <div key={id} className="border-l-4 border-slate-600 rounded-xl p-4 bg-white shadow hover:shadow-md transition">
              {editingId === id ? null : (
                <>
                  <p className="text-xs text-gray-400 mb-2">ID: <code>{id}</code></p>
                  <h4 className="text-lg font-semibold flex items-center gap-2 mb-1">
                    <Briefcase size={18} className="text-slate-600" /> {job.jobTitle}
                  </h4>
                  <p className="text-sm text-gray-700 mb-1"><strong>Description:</strong> {job.jobDescription}</p>
                  <p className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <Building2 size={16} className="text-gray-500" />
                    <span>{job.office} ({job.areaType} - {job.areaCode})</span>
                  </p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Level:</strong> {job.level}</p>
                  <p className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <Coins size={16} className="text-yellow-500" />
                    ₱{job.annualSalaryActual.toLocaleString()} (Authorized: ₱{job.annualSalaryAuthorized.toLocaleString()})
                  </p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Salary Grade:</strong> {job.salaryGrade}, Step: {job.step}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Plantilla Position:</strong> {job.plantillaPosition}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>PPA Attribution:</strong> {job.ppaAttribution}</p>
                  <p className="text-sm text-gray-700 flex items-start gap-2 mb-2">
                    <Wrench size={16} className="text-purple-500 mt-[2px]" />
                    {job.requiredSkills?.join(', ') || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Vacancies:</strong> {job.vacancies}</p>
                  <p
                    onClick={() => openModal(job)}
                    className="text-sm text-slate-600 flex items-center gap-2 mt-2 cursor-pointer hover:underline"
                  >
                    <Users size={16} className="text-slate-600" />
                    Applicants: {
                      Array.isArray(job.applicants)
                        ? job.applicants.length
                        : job.applicants
                          ? Object.keys(job.applicants).length
                          : 0
                    }

                  </p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => startEdit(id)} className="text-sm px-3 py-1 bg-slate-500 text-white rounded hover:bg-slate-600 transition" disabled={adding}>Edit</button>
                    <button onClick={() => handleDelete(id)} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" disabled={adding}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

{modalJob && (
  <Modal onClose={closeModal}>
    <h3 className="text-lg font-bold mb-4">{modalJob.jobTitle}</h3>
    <p className="mb-4">{modalJob.jobDescription}</p>

    <div  className="max-h-[60vh] overflow-y-auto pr-2">
      <h4 className="font-semibold mb-3">Applicants:</h4>

      {applicantDetails.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applicantDetails.map((app) => (
            <div
              key={app.id}
              className="relative border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col"
            >
              {/* Skill Match percentage badge */}
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                {app.skillMatch ? `${app.skillMatch}%` : 'N/A'}
              </div>

              {/* Applicant Info */}
              <div className="flex items-center gap-4 mb-3">
                {app.photoURL ? (
                  <img
                    src={app.photoURL}
                    alt={app.name || 'Applicant photo'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                    No Photo
                  </div>
                )}
                <div>
                  <h5 className="text-lg font-semibold">{app.name || 'Unnamed Applicant'}</h5>
                  <p className="text-sm text-gray-600">{app.email || 'No email provided'}</p>
                  <p className="text-xs text-gray-400">ID: {app.id}</p>
                </div>
              </div>

              {/* Applicant Details */}
              <div className="flex-grow">
                <p><strong>Contact Number:</strong> {app.contactNumber || 'N/A'}</p>
                <p><strong>Gender:</strong> {app.gender || 'N/A'}</p>
                <p><strong>Applied At:</strong> {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : 'N/A'}</p>
                <p><strong>Skills:</strong> {app.skills?.join(', ') || 'N/A'}</p>
                {app.resumeURL && (
                  <p>
                    <a
                      href={app.resumeURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </p>
                )}
              </div>

              {/* Accept Button */}
              <button
                onClick={() => handleAccept(app.id)}
                className="mt-4 self-end px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </Modal>
)}





    </div>
  );
}

function JobForm({ formData, setFormData }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Job Title"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.jobTitle}
        onChange={(e) => setFormData(f => ({ ...f, jobTitle: e.target.value }))}
      />
      <textarea
        placeholder="Job Description"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm resize-y"
        value={formData.jobDescription}
        onChange={(e) => setFormData(f => ({ ...f, jobDescription: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Office"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.office}
        onChange={(e) => setFormData(f => ({ ...f, office: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Level"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.level}
        onChange={(e) => setFormData(f => ({ ...f, level: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Annual Salary Actual"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.annualSalaryActual}
        onChange={(e) => setFormData(f => ({ ...f, annualSalaryActual: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Annual Salary Authorized"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.annualSalaryAuthorized}
        onChange={(e) => setFormData(f => ({ ...f, annualSalaryAuthorized: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Area Code"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.areaCode}
        onChange={(e) => setFormData(f => ({ ...f, areaCode: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Area Type"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.areaType}
        onChange={(e) => setFormData(f => ({ ...f, areaType: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Item Number"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.itemNumber}
        onChange={(e) => setFormData(f => ({ ...f, itemNumber: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Plantilla Position"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.plantillaPosition}
        onChange={(e) => setFormData(f => ({ ...f, plantillaPosition: e.target.value }))}
      />
      <input
        type="text"
        placeholder="PPA Attribution"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.ppaAttribution}
        onChange={(e) => setFormData(f => ({ ...f, ppaAttribution: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Required Skills (comma-separated)"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.requiredSkills}
        onChange={(e) => setFormData(f => ({ ...f, requiredSkills: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Salary Grade"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.salaryGrade}
        onChange={(e) => setFormData(f => ({ ...f, salaryGrade: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Step"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.step}
        onChange={(e) => setFormData(f => ({ ...f, step: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Vacancies"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-slate-400 text-sm"
        value={formData.vacancies}
        onChange={(e) => setFormData(f => ({ ...f, vacancies: e.target.value }))}
      />
    </div>
  );
}
