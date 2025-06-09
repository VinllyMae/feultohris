import React, { useState, useEffect, useRef } from 'react';
import {
  getDatabase,
  ref as dbRef,
  update,
  get,
  onValue,
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getAuth, signOut } from 'firebase/auth';

const ApplicantDashboard = ({ user }) => {
  const database = getDatabase();
  const storage = getStorage();

  const [profile, setProfile] = useState({
    email: '',
    contactNumber: '',
    photoURL: '',
    gender: '',
    skills: [],
    resumeURL: '',
    workExperienceFileURL: '',
    personalDataFileURL: '',
    workExperiences: []
  });
  const [selectedSection, setSelectedSection] = useState('profile');

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [input, setInput] = useState('');

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {

    if (!user) return;
    const profileRef = dbRef(database, `applicants/${user.uid}`);
    const unsubscribe = onValue(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let loadedSkills = [];
        if (Array.isArray(data.skills)) {
          loadedSkills = data.skills;
        } else if (typeof data.skills === 'string') {
          loadedSkills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
        console.log("data", data);

        // <-- Put the workExperiences loading here
        let loadedWorkExperiences = [];
        if (data.workExperiences) {
          try {
            loadedWorkExperiences = Array.isArray(data.workExperiences)
              ? data.workExperiences
              : JSON.parse(data.workExperiences);
          } catch {
            loadedWorkExperiences = [];
          }
        }
        console.log("loadedWorkExperiences", loadedWorkExperiences);
        const newProfile = {
          email: data.email || '',
          contactNumber: data.contactNumber || '',
          photoURL: data.photoURL || '',
          gender: data.gender || '',
          skills: loadedSkills,
          resumeURL: data.resumeURL || '',
          workExperienceFileURL: data.workExperienceFileURL || '',
          personalDataFileURL: data.personalDataFileURL || '',
          workExperiences: loadedWorkExperiences
        };
        setProfile(newProfile);
        profileRefState.current = newProfile; // Update ref too
      }
    });
    return () => unsubscribe();
  }, [user, database]);
  useEffect(() => {
    if (isEditing) {
      setWorkExperiences(profile.workExperiences || []);
    }
  }, [isEditing, profile.workExperiences]);

  useEffect(() => {
    if (!user) return;

    const fetchJobsAndApplied = async () => {
      try {
        const snapshot = await get(dbRef(database, 'jobs'));
        if (snapshot.exists()) {
          const jobsData = snapshot.val();
          const jobList = Object.entries(jobsData).map(([id, job]) => ({ id, ...job }));
          setJobs(jobList);

          // Find which jobs the user has applied to
          const appliedJobIds = Object.entries(jobsData).reduce((acc, [jobId, job]) => {
            if (job.applicants && job.applicants[user.uid]) {
              acc.push(jobId);
            }
            return acc;
          }, []);
          setAppliedJobs(new Set(appliedJobIds));
        } else {
          setJobs([]);
          setAppliedJobs(new Set());
        }
      } catch (e) {
        setError('Failed to load jobs');
        setAppliedJobs(new Set());
      }
    };

    fetchJobsAndApplied();
  }, [database, user]);


  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
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
      if (input.trim()) {
        addSkill(input);
        setInput('');
      }
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setError('');
    try {
      const profileRef = dbRef(database, `applicants/${user.uid}`);
      await update(profileRef, {
        email: profile.email,
        contactNumber: profile.contactNumber,
        gender: profile.gender,
        skills: profile.skills.join(','),
        workExperiences: JSON.stringify(workExperiences),  // save as JSON string
      });
      console.log("loadedWorkExperiences", workExperiences);

      alert('Profile updated successfully');
      setIsEditing(false);
    } catch {
      setError('Failed to update profile');
    }
  };
  const profileRefState = useRef(profile);

  const handleFileUpload = async (e, type) => {
    if (!user) return;
    const file = e.target.files[0];
    if (!file) return;

    const setUploading = setUploadingPhoto; // We use just this for now to avoid defining separate states
    setUploading(true);
    setError('');

    try {
      const path = `applicantFiles/${user.uid}/${type}/${file.name}`;
      const fileRef = storageRef(storage, path);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error(error);
          setError(`Upload failed for ${type}`);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const field = getFileFieldKey(type);

          const profileDBRef = dbRef(database, `applicants/${user.uid}`);
          await update(profileDBRef, { [field]: downloadURL });

          const updatedProfile = {
            ...profileRefState.current,
            [field]: downloadURL,
          };
          setProfile(updatedProfile);
          profileRefState.current = updatedProfile; // Update ref too
          setUploading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setError(`Upload failed for ${type}`);
      setUploading(false);
    }
  };
  const [workExperiences, setWorkExperiences] = useState([
    { jobTitle: '', years: '', company: '', description: '' },
  ]);
  const handleExperienceChange = (index, field, value) => {
    const updated = [...workExperiences];
    updated[index][field] = value;
    setWorkExperiences(updated);
  };


  const addExperience = () => {
    setWorkExperiences(prev => [
      ...prev,
      {
        jobTitle: '',
        years: '',
        company: '',
        description: ''
      }
    ]);
  };


  const removeExperience = (index) => {
    const updated = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(updated);
  };

  const getFileFieldKey = (type) => {
    switch (type) {
      case 'photo':
        return 'photoURL';
      case 'resume':
        return 'resumeURL';
      case 'work':
        return 'workExperienceFileURL';
      case 'personal':
        return 'personalDataFileURL';
      default:
        return '';
    }
  };

  {/* Shared styles for elegant inputs */ }
  const inputClass = `w-full bg-transparent border-b border-gray-300 focus:border-pink-500 focus:outline-none
  text-gray-800 placeholder-gray-400 py-1 mb-1 transition`;

  const handleApply = async (jobId, matchPercentage) => {
    if (appliedJobs.has(jobId) || !user || !profile) return;

    setApplyingJobId(jobId);
    setError('');

    try {
      const applicantInfo = {
        email: profile.email || '',
        contactNumber: profile.contactNumber || '',
        gender: profile.gender || '',
        photoURL: profile.photoURL || '',
        resumeURL: profile.resumeURL || '',
        skills: profile.skills || [],
        skillMatch: matchPercentage,
        appliedAt: Date.now(),
      };

      // Write to job -> applicants
      const jobApplicantRef = dbRef(database, `jobs/${jobId}/applicants/${user.uid}`);

      // Write to applicant -> appliedJobs
      const applicantAppliedJobsRef = dbRef(database, `applicants/${user.uid}/appliedJobs/${jobId}`);

      await Promise.all([
        update(jobApplicantRef, applicantInfo),
        update(applicantAppliedJobsRef, {
          jobId,
          appliedAt: Date.now(),
          skillMatch: matchPercentage,
        }),
      ]);

      setAppliedJobs((prev) => new Set(prev).add(jobId));
    } catch (error) {
      console.error("Apply failed:", error);
      setError("Failed to apply for job.");
    } finally {
      setApplyingJobId(null);
    }
  };


  const displayExperiences = isEditing ? workExperiences : profile.workExperiences;



  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-pink-600">Applicant</h2>
        <nav className="space-y-4">
          <button
            onClick={() => setSelectedSection('profile')}
            className={`block w-full text-left text-gray-700 hover:text-pink-600 ${selectedSection === 'profile' ? 'font-bold text-pink-600' : ''
              }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setSelectedSection('jobs')}
            className={`block w-full text-left text-gray-700 hover:text-pink-600 ${selectedSection === 'jobs' ? 'font-bold text-pink-600' : ''
              }`}
          >
            Jobs Posted
          </button>
          <a
            onClick={handleLogout}
            className="block text-red-600 cursor-pointer hover:underline"
          >
            Logout
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-200 w-full">
        {selectedSection === 'profile' && (
          <section id="profile" className="mx-auto p-6 space-y-8">
            {/* Profile Card */}
            <div className="flex justify-center shadow-xl rounded-3xl bg-white p-8 relative">
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-6 right-6 text-pink-600 font-semibold hover:underline transition"
                aria-label={isEditing ? 'Cancel editing profile' : 'Edit profile'}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>

              {/* Left: Profile Image */}
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-8 border-pink-400 shadow-lg">
                  <img
                    src={profile.photoURL || '/default-profile.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-3 right-3 bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full cursor-pointer shadow-md transition"
                      title="Change Profile Photo"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21v-4a2 2 0 012-2h4m3 3l7-7" />
                      </svg>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'photo')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-500 italic">Click the camera icon to change photo</p>
              </div>

              {/* Right: Details */}
              <div className="flex flex-col justify-center flex-1 pl-12">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{profile.username || 'Applicant'}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-gray-700">{profile.email || 'No email'}</p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={profile.contactNumber}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                        placeholder="Enter contact number"
                      />
                    ) : (
                      <p className="text-gray-700">{profile.contactNumber || 'No contact number'}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="LGBT+">LGBT+</option>
                      </select>
                    ) : (
                      <p className="text-gray-700">{profile.gender || 'Gender not specified'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Resume & Skills Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Resume Upload */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Resume</h3>
                  {profile.resumeURL ? (
                    <a
                      href={profile.resumeURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-semibold hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    <p className="text-gray-400 italic">No resume uploaded</p>
                  )}
                  {isEditing && (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'resume')}
                      className="mt-3 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    />
                  )}
                </div>

                {/* Work Experience Upload */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Work Experience</h3>
                  {profile.workExperienceFileURL ? (
                    <a
                      href={profile.workExperienceFileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-semibold hover:underline"
                    >
                      View Work Experience
                    </a>
                  ) : (
                    <p className="text-gray-400 italic">No work experience file uploaded</p>
                  )}
                  {isEditing && (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'work')}
                      className="mt-3 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    />
                  )}
                </div>

                {/* Personal Data Sheet Upload */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Personal Data Sheet</h3>
                  {profile.personalDataFileURL ? (
                    <a
                      href={profile.personalDataFileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-semibold hover:underline"
                    >
                      View Personal Data
                    </a>
                  ) : (
                    <p className="text-gray-400 italic">No personal data uploaded</p>
                  )}
                  {isEditing && (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'personal')}
                      className="mt-3 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    />
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">Skills</h3>

                {profile.skills.length === 0 && <p className="text-gray-400 italic mb-4">No skills added.</p>}

                <ul className="flex flex-wrap gap-3 mb-6">
                  {profile.skills.map((skill) => (
                    <li
                      key={skill}
                      className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full flex items-center gap-2 font-medium"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-pink-600 hover:text-pink-800 font-bold"
                          aria-label={`Remove skill ${skill}`}
                        >
                          &times;
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {isEditing && (
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  />
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition shadow-lg"
                  >
                    Save Profile
                  </button>
                </div>
              )}

              {/* Error */}
              {error && <p className="mt-6 text-red-600 font-semibold">{error}</p>}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Work Experience</h3>

              {displayExperiences.length === 0 && !isEditing && (
                <p className="text-gray-500 italic">No work experiences available.</p>
              )}

              {displayExperiences.map((exp, index) => (
                <div
                  key={index}
                  className={`mb-6 relative ${isEditing
                    ? 'bg-white p-4 rounded-lg shadow-sm'
                    : 'bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm'
                    }`}
                >
                  {isEditing ? (
                    <>
                      {/* Remove Button */}
                      <button
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => removeExperience(index)}
                        aria-label="Remove work experience"
                        title="Remove Experience"
                      >
                        ✕
                      </button>

                      {/* Job Title */}
                      <input
                        type="text"
                        placeholder="Job Title"
                        className={inputClass}
                        value={exp.jobTitle}
                        onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                      />

                      {/* Years of Experience */}
                      <input
                        type="number"
                        placeholder="Years of Experience"
                        className={inputClass}
                        value={exp.years}
                        onChange={(e) => handleExperienceChange(index, 'years', e.target.value)}
                      />

                      {/* Company */}
                      <input
                        type="text"
                        placeholder="Company"
                        className={inputClass}
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      />

                      {/* Description */}
                      <textarea
                        placeholder="Description"
                        className="w-full bg-transparent border-b border-gray-300 focus:border-pink-500 focus:outline-none text-gray-800 placeholder-gray-400 py-1 resize-none mt-2"
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      {/* Display Mode */}
                      <p className="text-gray-800 font-semibold mb-1">
                        <span className="text-pink-600">Job Title:</span> {exp.jobTitle || 'N/A'}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>Years of Experience:</strong> {exp.years || 'N/A'}
                      </p>
                      <p className="text-gray-700 mb-1">
                        <strong>Company:</strong> {exp.company || 'N/A'}
                      </p>
                      <p className="text-gray-700 whitespace-pre-line">
                        <strong>Description:</strong> {exp.description || 'N/A'}
                      </p>
                    </>
                  )}
                </div>
              ))}

              {isEditing && (
                <button onClick={addExperience} className="btn btn-outline btn-sm mt-2">
                  + Add More Experience
                </button>
              )}
            </div>

          </section>
        )}

        {selectedSection === 'jobs' && (
          <section id="jobs" className="p-6">
            <div className="relative bg-white shadow-lg rounded-xl p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Available Jobs</h3>

              <ul className="space-y-6">
                {jobs.map((job) => {
                  const jobSkills = Array.isArray(job.requiredSkills)
                    ? job.requiredSkills
                    : typeof job.requiredSkills === 'string'
                      ? job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
                      : [];

                  const matchedSkills = jobSkills.filter((skill) => profile.skills.includes(skill));
                  const matchPercentage = jobSkills.length > 0
                    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
                    : 0;

                  return (
                    <li
                      key={job.id}
                      className={`relative border rounded-xl p-5 hover:shadow-lg transition-shadow duration-300
    ${matchPercentage < 50 ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white border-gray-200'}
  `}
                    >
                      {/* Match Percentage Badge */}
                      {jobSkills.length > 0 && (
                        <div className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full select-none
      ${matchPercentage < 50 ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-800'}`}>
                          {matchPercentage}% Match
                        </div>
                      )}

                      <h4 className="text-lg font-bold mb-1">
                        {job.jobTitle || job.position || 'Job Title Unavailable'}
                      </h4>
                      {job.position && job.position !== job.jobTitle && (
                        <p className="text-sm italic mb-2">{job.position}</p>
                      )}

                      <p className="mb-4">{job.jobDescription || 'No job description available.'}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {jobSkills.length > 0 ? (
                          jobSkills.map((skill) => (
                            <span
                              key={skill}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.skills.includes(skill)
                                ? 'bg-pink-200 text-pink-800'
                                : 'bg-gray-200 text-gray-600'
                                }`}
                              title={skill}
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs italic">No skills required</span>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          disabled={applyingJobId === job.id || appliedJobs.has(job.id) || matchPercentage < 50}
                          onClick={() => handleApply(job.id, matchPercentage)}
                          className={`w-28 rounded-lg px-4 py-2 text-white font-semibold transition-colors
        ${appliedJobs.has(job.id) || matchPercentage < 50
                              ? 'bg-gray-500 cursor-not-allowed'
                              : applyingJobId === job.id
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-pink-500 hover:bg-pink-600'
                            }`}
                        >
                          {appliedJobs.has(job.id)
                            ? 'Applied'
                            : applyingJobId === job.id
                              ? 'Applying...'
                              : 'Apply'}
                        </button>
                      </div>
                    </li>

                  );
                })}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div >
  );
};

export default ApplicantDashboard;
