export default function EmployeeList({ employees, onEdit, onDelete }) {
  return (
    <div>
      {Object.entries(employees).length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Position</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(employees).map(([id, emp]) => (
              <tr key={id}>
                <td className="border border-gray-300 p-2">{emp.name}</td>
                <td className="border border-gray-300 p-2">{emp.email}</td>
                <td className="border border-gray-300 p-2">{emp.department}</td>
                <td className="border border-gray-300 p-2">{emp.position}</td>
                <td className="border border-gray-300 p-2">{emp.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    onClick={() => onEdit(id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => onDelete(id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}