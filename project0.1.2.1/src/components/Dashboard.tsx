import { Users, FolderGit2, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    { icon: Users, title: '学生', count: '120 名活跃', path: '/students' },
    { icon: FolderGit2, title: '项目', count: '25 个活跃', path: '/projects' },
    { icon: FileText, title: '资源', count: '45 个文件', path: '/resources' },
    { icon: Calendar, title: '演示', count: '8 个即将进行', path: '/presentations' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <item.icon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">最近活动</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium">新资源已上传</p>
                  <p className="text-xs text-gray-500">2小时前</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">即将进行的演示</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">组{i}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">第{i}组演示</p>
                    <p className="text-xs text-gray-500">项目评审</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">明天</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}