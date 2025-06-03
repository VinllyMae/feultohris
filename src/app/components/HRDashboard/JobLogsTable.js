'use client';

export default function JobLogsTable({ logs }) {
  if (!logs || logs.length === 0) {
    return <p className="text-gray-500 mt-4">No HR logs available.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">HR Job Activity Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Job ID</th> {/* ✅ Added Job ID column */}
              <th className="p-2 border">Job Title</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Performed By</th>
              <th className="p-2 border">Changes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-2 border">{log.action}</td>
                <td className="p-2 border">{log.jobId || '—'}</td> {/* ✅ Display jobId here */}
                <td className="p-2 border">{log.data?.title || '—'}</td>
                <td className="p-2 border">{log.data?.department || '—'}</td>
                <td className="p-2 border">{log.performedBy}</td>
                <td className="p-2 border">
                  {log.action === 'Updated' && log.changes && Object.keys(log.changes).length > 0 ? (
                    <ul className="list-disc ml-5">
                      {Object.entries(log.changes).map(([field, change]) => (
                        <li key={field}>
                          <strong>{field}:</strong> {change.from} → {change.to}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
