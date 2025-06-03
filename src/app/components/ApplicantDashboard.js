import React, { useState, useEffect } from 'react';
import {
  getDatabase,
  ref as dbRef,
  update,
  get,
  set,
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const ApplicantDashboard = ({ user, profile: initialProfile }) => {
  const database = getDatabase();
  const storage = getStorage();

  // Fix skills initialization: support array or comma-separated string or undefined
  const initialSkills = Array.isArray(initialProfile?.skills)
    ? initialProfile.skills
    : typeof initialProfile?.skills === 'string'
      ? initialProfile.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const [profile, setProfile] = useState({
    email: initialProfile?.email || '',
    contactNumber: initialProfile?.contactNumber || '',
    photoURL: initialProfile?.photoURL || '',
    gender: initialProfile?.gender || '',
    skills: initialSkills,
    resumeURL: initialProfile?.resumeURL || '',
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState(null);

  // Skill input states and handlers
  const [input, setInput] = useState('');

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
      setInput('');
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await get(dbRef(database, 'jobs'));
        if (snapshot.exists()) {
          const jobsData = snapshot.val();
          const jobList = Object.entries(jobsData).map(([id, job]) => ({
            id,
            ...job,
          }));
          setJobs(jobList);
        }
      } catch {
        setError('Failed to load jobs');
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setError('');

    try {
      const profileRef = dbRef(database, `applicants/${user.uid}`);
      // Save skills as a comma-separated string to Firebase
      await update(profileRef, {
        email: profile.email,
        contactNumber: profile.contactNumber,
        gender: profile.gender,
        skills: profile.skills.join(','),
      });
      alert('Profile updated successfully');
    } catch {
      setError('Failed to update profile');
    }
  };

  const handleFileUpload = async (e, type) => {
    if (!user) return;
    const file = e.target.files[0];
    if (!file) return;

    const setUploading = type === 'photo' ? setUploadingPhoto : setUploadingResume;
    setUploading(true);
    setError('');

    try {
      const path =
        type === 'photo'
          ? `applicantPhotos/${user.uid}/${file.name}`
          : `applicantResumes/${user.uid}/${file.name}`;
      const fileRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        null,
        () => {
          setError(`Upload failed for ${type}`);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const profileRef = dbRef(database, `applicants/${user.uid}`);
          await update(profileRef, {
            [type === 'photo' ? 'photoURL' : 'resumeURL']: downloadURL,
          });
          setProfile((prev) => ({
            ...prev,
            [type === 'photo' ? 'photoURL' : 'resumeURL']: downloadURL,
          }));
          setUploading(false);
        }
      );
    } catch {
      setError(`Upload failed for ${type}`);
      setUploading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!user) return;
    setApplyingJobId(jobId);
    setError('');

    try {
      const appRef = dbRef(database, `applications/${jobId}/${user.uid}`);
      await set(appRef, {
        applicantId: user.uid,
        jobId,
        appliedAt: new Date().toISOString(),
        status: 'Pending',
      });
      alert('Applied successfully!');
    } catch {
      setError('Failed to apply for job');
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6 grid-rows-2">
      {/* Profile Card */}
      <div className="flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-full">
          <div className="relative mb-5 mx-auto w-32 h-32">
            <img
              src={profile.photoURL || '/default-profile.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-400"
            />
            <label
              htmlFor="file-upload"
              className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-pink-600 transition"
              title="Change Photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21v-4a2 2 0 012-2h4m3 3l7-7"
                />
              </svg>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'photo')}
                className="hidden"
              />
            </label>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800">{profile.username}</h2>
          <p className="text-gray-500 mt-1">{profile.email}</p>
          <p className="text-gray-500">{profile.contact || 'No contact number'}</p>
        </div>
      </div>

      {/* Job Application Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 col-span-1 row-span-2">
        <h3 className="text-lg font-semibold mb-4">Available Jobs</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs available.</p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id} className="border rounded p-3">
                <h4 className="font-medium">{job.title}</h4>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={applyingJobId === job.id}
                  className="text-sm mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full"
                >
                  {applyingJobId === job.id ? 'Applying...' : 'Apply'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Resume + Skills Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 col-span-1">
        <h3 className="text-lg font-semibold mb-4">Resume & Skills</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Resume</label>
          {profile.resumeURL ? (
            <a
              href={profile.resumeURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Resume
            </a>
          ) : (
            <p className="text-gray-500">No resume uploaded</p>
          )}
          <label className="block mt-2">
            <span className="sr-only">Upload your resume (PDF only)</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, 'resume')}
              className="block w-full text-sm text-gray-600
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-pink-50 file:text-pink-700
               hover:file:bg-pink-100
               mt-2"
            />
          </label>

        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="bg-pink-300 px-3 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => removeSkill(skill)}
                title="Click to remove"
              >
                {skill} &times;
              </span>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add skills and press Enter"
            className="border rounded px-3 py-1 w-full"
          />
        </div>

        <button
          onClick={() => handleSave()}
          className="mt-8 bg-pink-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-pink-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
