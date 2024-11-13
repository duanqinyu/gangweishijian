import React, { useState } from 'react';
import { Search, FolderGit2, Filter, MoreVertical } from 'lucide-react';
import type { Project } from '../../types';

const mockProjects: Project[] = [
  { id: '1', name: '电商平台', description: '构建全栈电商解决方案', gitRepo: 'https://github.com/example/ecommerce', groupId: '第一组' },
  { id: '2', name: '任务管理器', description: '协作任务管理应用', gitRepo: 'https://github.com/example/taskmanager', groupId: '第二组' },
  { id: '3', name: '作品集网站', description: '个人作品集网站模板', gitRepo: 'https://github.com/example/portfolio', groupId: '第三组' },
];

export default function ProjectList() {
  const [projects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">项目管理</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <FolderGit2 className="h-5 w-5" />
            新建项目
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索项目..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            筛选
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{project.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {project.groupId}
                </span>
                <a
                  href={project.gitRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  查看仓库
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}