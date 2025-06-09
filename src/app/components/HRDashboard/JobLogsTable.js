'use client';

export default function JobLogsTable({ logs }) {
  if (!logs || logs.length === 0) {
    return <p className="text-gray-500 mt-4">No HR logs available.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">HR Job Activity Logs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2 hover:shadow-md transition"
          >
            <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
            <div className="text-sm font-semibold text-blue-600">{log.action}</div>

            <div className="text-sm text-gray-700">
              <strong>Job ID:</strong> {log.jobId || '—'}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Title:</strong> {log.data?.title || '—'}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Department:</strong> {log.data?.department || '—'}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Performed By:</strong> {log.performedBy}
            </div>

            <div className="text-sm text-gray-700">
              <strong>Changes:</strong>
              {log.action === 'Updated' && log.changes && Object.keys(log.changes).length > 0 ? (
                <ul className="list-disc ml-5 mt-1 text-gray-600">
                  {Object.entries(log.changes).map(([field, change]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {change.from} → {change.to}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 ml-1">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
