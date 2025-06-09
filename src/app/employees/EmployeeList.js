import { useState } from 'react';
import { Eye, X, Pencil, Trash } from 'lucide-react';

export default function EmployeeList({ employees, onEdit, onDelete }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Change this to how many rows you want per page

  const employeeEntries = Object.entries(employees);
  const totalPages = Math.ceil(employeeEntries.length / itemsPerPage);

  // Get only employees for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = employeeEntries.slice(startIndex, startIndex + itemsPerPage);

  const openModal = (employee) => setSelectedEmployee(employee);
  const closeModal = () => setSelectedEmployee(null);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Department</th>
              <th className="px-4 py-2 border">Position</th>
              <th className="px-4 py-2 border">Gender</th>
              <th className="px-4 py-2 border">Skills</th>
              <th className="px-4 py-2 border">Match %</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map(([id, emp]) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{emp.name}</td>
                <td className="px-4 py-2 border">{emp.department}</td>
                <td className="px-4 py-2 border">{emp.position}</td>
                <td className="px-4 py-2 border">{emp.gender}</td>
                <td className="px-4 py-2 border">
                  {emp.skills?.slice(0, 2).join(', ')}
                  {emp.skills?.length > 2 ? '…' : ''}
                </td>
                <td className="px-4 py-2 border text-center">{emp.skillsPercentage}%</td>
                <td className="px-4 py-2 border text-center space-x-1">
                  <button
                    onClick={() => openModal(emp)}
                    className="text-blue-600 hover:underline"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(id)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 relative shadow-2xl border border-gray-200 transition-all duration-300">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-slate-700 border-b pb-2">{selectedEmployee.name}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-700">
              <p><span className="font-medium text-slate-600">Email:</span> {selectedEmployee.email}</p>
              <p><span className="font-medium text-slate-600">Contact:</span> {selectedEmployee.contact}</p>
              <p><span className="font-medium text-slate-600">Gender:</span> {selectedEmployee.gender}</p>
              <p><span className="font-medium text-slate-600">Status:</span> {selectedEmployee.status}</p>
              <p><span className="font-medium text-slate-600">Department:</span> {selectedEmployee.department}</p>
              <p><span className="font-medium text-slate-600">Position:</span> {selectedEmployee.position}</p>
              <p><span className="font-medium text-slate-600">Salary Grade:</span> {selectedEmployee.salaryGrade}</p>
              <p><span className="font-medium text-slate-600">Annual Salary (Auth.):</span> ₱{selectedEmployee.annualSalaryAuthorized?.toLocaleString?.() || 'N/A'}</p>
              <p><span className="font-medium text-slate-600">Annual Salary (Actual):</span> ₱{selectedEmployee.annualSalaryActual?.toLocaleString?.() || 'N/A'}</p>
              <p><span className="font-medium text-slate-600">Hire Date:</span> {selectedEmployee.hireDate}</p>
              <p><span className="font-medium text-slate-600">Step:</span> {selectedEmployee.step}</p>
              <p><span className="font-medium text-slate-600">Office:</span> {selectedEmployee.office}</p>
              <p><span className="font-medium text-slate-600">Plantilla Position:</span> {selectedEmployee.plantillaPosition}</p>
              <p><span className="font-medium text-slate-600">Plantilla Location:</span> {selectedEmployee.plantillaLocation}</p>
              <p><span className="font-medium text-slate-600">Place of Assignment:</span> {selectedEmployee.placeOfAssignment}</p>
              <p><span className="font-medium text-slate-600">Civil Service Eligibility:</span> {selectedEmployee.civilServiceEligibility}</p>
              <p><span className="font-medium text-slate-600">Area Code:</span> {selectedEmployee.areaCode}</p>
              <p><span className="font-medium text-slate-600">Type:</span> {selectedEmployee.type}</p>
              <p><span className="font-medium text-slate-600">Level:</span> {selectedEmployee.level}</p>
              <p><span className="font-medium text-slate-600">Item Number:</span> {selectedEmployee.itemNumber}</p>
              <p><span className="font-medium text-slate-600">P/P/A Attribution:</span> {selectedEmployee.ppaAttribution}</p>
              <p><span className="font-medium text-slate-600">TIN:</span> {selectedEmployee.tin}</p>
              <p><span className="font-medium text-slate-600">DOB:</span> {selectedEmployee.birthDate}</p>
              <p><span className="font-medium text-slate-600">Age:</span> {selectedEmployee.age}</p>
              <p><span className="font-medium text-slate-600">Original Appointment:</span> {selectedEmployee.dateOfOriginalAppointment}</p>
              <p><span className="font-medium text-slate-600">Last Promotion:</span> {selectedEmployee.lastPromotionDate}</p>
              <p><span className="font-medium text-slate-600">Matched Skills:</span> {selectedEmployee.jobSkillsMatched?.join(', ') || 'None'}</p>
              <p className="col-span-2"><span className="font-medium text-slate-600">All Skills:</span> {selectedEmployee.skills?.join(', ') || 'None'}</p>
              <p className="col-span-2"><span className="font-medium text-slate-600">Skill Match %:</span> {selectedEmployee.skillsPercentage}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
