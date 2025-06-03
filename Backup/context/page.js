import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import JobApplications from '@/components/JobApplications';
import CalendarC from '../components/CalendarC';
import Requests from '../components/Requests';

const Home = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="ml-64 w-full p-6 flex flex-col h-full text-gray-700">
        <div className="flex flex-1 gap-6">
          {/* Row 1 (Dashboard, Job Applications) */}
          <div className="flex flex-col flex-1 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-gray-100 z-10">
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              <div className="mb-8">
                <Dashboard />
              </div>
              <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
              <div className="mt-4">
                <JobApplications />
              </div>
            </div>
          </div>

          {/* Row 2 (Calendar) */}
          <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-gray-100 z-10">
            <h2 className="text-2xl font-bold mb-4">Calendar</h2>
            <CalendarC />
          </div>
        </div>

        {/* Row 3 (Requests) - Spans 2 Columns */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-100 z-10">
          <h2 className="text-2xl font-bold mb-4">Requests</h2>
          <Requests />
        </div>
      </div>
    </div>
  );
};

export default Home;
