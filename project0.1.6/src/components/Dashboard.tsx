import { Users, FolderGit2, FileText, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../store/studentStore';
import { useProjectStore } from '../store/projectStore';
import { useResourceStore } from '../store/resourceStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { students } = useStudentStore();
  const { projects } = useProjectStore();
  const { resources } = useResourceStore();

  const cards = [
    { icon: Users, title: '学生', count: `${students.length} 名`, subtitle: '学生', path: '/students' },
    { icon: FolderGit2, title: '项目', count: `${projects.length} 个`, subtitle: '项目', path: '/projects' },
    { icon: FileText, title: '资源', count: `共${resources.length}个`, subtitle: '资源', path: '/resources' },
    { icon: Calendar, title: '展示', count: '8 场', subtitle: '即将进行', path: '/presentations' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(card.path)}
          >
            <div className="flex items-center">
              <card.icon className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-gray-600">{card.count} {card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">最近活动</h2>
          <div className="space-y-4">
            {[
              { text: '新资源上传', time: '2小时前' },
              { text: '项目状态更新', time: '4小时前' },
              { text: '新学生加入', time: '1天前' }
            ].map((activity, i) => (
              <div key={i} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">即将进行的展示</h2>
          <div className="space-y-4">
            {[
              { group: '1', title: '电商平台', time: '明天' },
              { group: '2', title: '任务管理器', time: '后天' },
              { group: '3', title: '作品集网站', time: '下周一' }
            ].map((presentation) => (
              <div key={presentation.group} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">组{presentation.group}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">第{presentation.group}组展示</p>
                    <p className="text-xs text-gray-500">{presentation.title}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{presentation.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}