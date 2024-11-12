import { Users, FolderGit2, FileText, Calendar } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Students</h2>
              <p className="text-gray-600">120 Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FolderGit2 className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Projects</h2>
              <p className="text-gray-600">25 Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Resources</h2>
              <p className="text-gray-600">45 Files</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Presentations</h2>
              <p className="text-gray-600">8 Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium">New resource uploaded</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Presentations</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">G{i}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Group {i} Presentation</p>
                    <p className="text-xs text-gray-500">Project Review</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">Tomorrow</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}