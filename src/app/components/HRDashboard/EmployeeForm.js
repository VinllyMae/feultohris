import { useState, useEffect } from 'react';

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('Active');
  const [position, setPosition] = useState('');
  const [salaryGrade, setSalaryGrade] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [office, setOffice] = useState('');
  const [plantillaPosition, setPlantillaPosition] = useState('');
  const [civilServiceEligibility, setCivilServiceEligibility] = useState('');
  const [step, setStep] = useState('');
  const [areaCode, setAreaCode] = useState('');
  const [type, setType] = useState('');
  const [level, setLevel] = useState('');
  const [plantillaLocation, setPlantillaLocation] = useState('');
  const [placeOfAssignment, setPlaceOfAssignment] = useState('');
  const [skills, setSkills] = useState('');

  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setEmail(employee.email || '');
      setContact(employee.contact || '');
      setDepartment(employee.department || '');
      setStatus(employee.status || 'Active');
      setPosition(employee.position || '');
      setSalaryGrade(employee.salaryGrade || '');
      setHireDate(employee.hireDate || '');
      setOffice(employee.office || '');
      setPlantillaPosition(employee.plantillaPosition || '');
      setCivilServiceEligibility(employee.civilServiceEligibility || '');
      setStep(employee.step || '');
      setAreaCode(employee.areaCode || '');
      setType(employee.type || '');
      setLevel(employee.level || '');
      setPlantillaLocation(employee.plantillaLocation || '');
      setPlaceOfAssignment(employee.placeOfAssignment || '');
      setSkills((employee.skills || []).join(', '));
    }
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !department || !position) {
      alert('Please fill in all required fields.');
      return;
    }

    onSubmit(
      {
        name,
        email,
        contact,
        department,
        status,
        position,
        salaryGrade,
        hireDate,
        office,
        plantillaPosition,
        civilServiceEligibility,
        step,
        areaCode,
        type,
        level,
        plantillaLocation,
        placeOfAssignment,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      },
      employee?.id
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="font-semibold">Name*</span>
          <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className="block">
          <span className="font-semibold">Email*</span>
          <input type="email" className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="block">
          <span className="font-semibold">Contact</span>
          <input type="text" className="w-full p-2 border rounded" value={contact} onChange={(e) => setContact(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Department*</span>
          <input type="text" className="w-full p-2 border rounded" value={department} onChange={(e) => setDepartment(e.target.value)} required />
        </label>

        <label className="block">
          <span className="font-semibold">Status</span>
          <select className="w-full p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Active</option>
            <option>On Leave</option>
            <option>Resigned</option>
          </select>
        </label>

        <label className="block">
          <span className="font-semibold">Position*</span>
          <input type="text" className="w-full p-2 border rounded" value={position} onChange={(e) => setPosition(e.target.value)} required />
        </label>

        <label className="block">
          <span className="font-semibold">Salary Grade</span>
          <input type="text" className="w-full p-2 border rounded" value={salaryGrade} onChange={(e) => setSalaryGrade(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Hire Date</span>
          <input type="date" className="w-full p-2 border rounded" value={hireDate} onChange={(e) => setHireDate(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Office</span>
          <input type="text" className="w-full p-2 border rounded" value={office} onChange={(e) => setOffice(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Plantilla Position</span>
          <input type="text" className="w-full p-2 border rounded" value={plantillaPosition} onChange={(e) => setPlantillaPosition(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Civil Service Eligibility</span>
          <input type="text" className="w-full p-2 border rounded" value={civilServiceEligibility} onChange={(e) => setCivilServiceEligibility(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Step</span>
          <input type="text" className="w-full p-2 border rounded" value={step} onChange={(e) => setStep(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Area Code</span>
          <input type="text" className="w-full p-2 border rounded" value={areaCode} onChange={(e) => setAreaCode(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Type</span>
          <input type="text" className="w-full p-2 border rounded" value={type} onChange={(e) => setType(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Level</span>
          <input type="text" className="w-full p-2 border rounded" value={level} onChange={(e) => setLevel(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Plantilla Location</span>
          <input type="text" className="w-full p-2 border rounded" value={plantillaLocation} onChange={(e) => setPlantillaLocation(e.target.value)} />
        </label>

        <label className="block">
          <span className="font-semibold">Place of Assignment</span>
          <input type="text" className="w-full p-2 border rounded" value={placeOfAssignment} onChange={(e) => setPlaceOfAssignment(e.target.value)} />
        </label>

        <label className="block md:col-span-2">
          <span className="font-semibold">Skills (comma-separated)</span>
          <input type="text" className="w-full p-2 border rounded" value={skills} onChange={(e) => setSkills(e.target.value)} />
        </label>
      </div>

      <div className="mt-4 space-x-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {employee ? 'Update Employee' : 'Add Employee'}
        </button>
        <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
