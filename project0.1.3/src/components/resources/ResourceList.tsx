import React, { useState } from 'react';
import { Search, FileText, Filter, MoreVertical, Link as LinkIcon, FileUp } from 'lucide-react';
import type { Resource } from '../../types';

const mockResources: Resource[] = [
  { id: '1', title: '课程大纲', type: 'document', url: '/documents/syllabus.pdf', uploadedAt: new Date('2024-01-15') },
  { id: '2', title: '项目指南', type: 'document', url: '/documents/guidelines.pdf', uploadedAt: new Date('2024-01-20') },
  { id: '3', title: '学习平台', type: 'link', url: 'https://learning.example.com', uploadedAt: new Date('2024-01-25') },
];

export default function ResourceList() {
  const [resources] = useState<Resource[]>(mockResources);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-8 w-8 text-indigo-600" />;
      case 'link':
        return <LinkIcon className="h-8 w-8 text-green-600" />;
      case 'file':
        return <FileUp className="h-8 w-8 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">资源管理</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <FileUp className="h-5 w-5" />
            上传资源
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索资源..."
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

        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                {getResourceIcon(resource.type)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                <p className="text-sm text-gray-500">
                  上传时间：{resource.uploadedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {resource.type === 'link' ? '访问' : '下载'}
                </a>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}