// components/Requests.js
const Requests = () => {
    const leaveRequests = [
      {
        id: 1,
        name: 'John Doe',
        jobTitle: 'Software Engineer',
        period: 'Feb 20, 2025 - Feb 22, 2025',
        type: 'Sick Leave',
        status: 'Approved',
        date: '2025-02-19',
        notes: 'Feeling unwell, will resume after rest.',
      },
      {
        id: 2,
        name: 'Jane Smith',
        jobTitle: 'HR Manager',
        period: 'Mar 1, 2025 - Mar 5, 2025',
        type: 'Vacation',
        status: 'Pending',
        date: '2025-02-20',
        notes: 'Annual leave for personal reasons.',
      },
      {
        id: 3,
        name: 'James Brown',
        jobTitle: 'Accountant',
        period: 'Feb 25, 2025 - Feb 27, 2025',
        type: 'Personal Leave',
        status: 'Denied',
        date: '2025-02-21',
        notes: 'Need to take care of personal matters.',
      },
    ];
  
    return (
      <div className="bg-white p-4">        
        {/* Table */}
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Period</th>
              <th className="py-2 px-4 border-b text-left">Type</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id}>
                <td className="py-2 px-4 border-b flex items-center">
                  <img src={`/Images/Img${request.id}.png`} alt={request.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{request.name}</p>
                    <p className="text-sm text-gray-600">{request.jobTitle}</p>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{request.period}</td>
                <td className="py-2 px-4 border-b">{request.type}</td>
                <td className="py-2 px-4 border-b">{request.status}</td>
                <td className="py-2 px-4 border-b">{request.date}</td>
                <td className="py-2 px-4 border-b">{request.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Requests;
  