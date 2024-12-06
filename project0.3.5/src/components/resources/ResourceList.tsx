import React, { useState } from 'react';
import { Search, FileText, Filter, Edit2, Trash2, Link as LinkIcon, FileUp } from 'lucide-react';
import { useResourceStore } from '../../store/resourceStore';
import { useGroupStore } from '../../store/groupStore';
import AddResourceModal from './AddResourceModal';
import EditResourceModal from './EditResourceModal';
import type { Resource } from '../../types';

export default function ResourceList() {
  const { resources, removeResource } = useResourceStore();
  const { groups } = useGroupStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('全部');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === '全部' || resource.groupId === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'file':
        return <FileText className="h-8 w-8 text-indigo-600" />;
      case 'link':
        return <LinkIcon className="h-8 w-8 text-green-600" />;
    }
  };

  const handleDeleteResource = (id: string) => {
    if (window.confirm('确定要删除这个资源吗？')) {
      removeResource(id);
    }
  };

  const handleDownload = (resource: Resource) => {
    if (resource.type === 'file') {
      const path = window.require('path');
      const downloadsPath = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads');
      const filePath = path.join(downloadsPath, path.basename(resource.url));
      window.open(`file://${filePath}`);
    } else {
      window.open(resource.url, '_blank');
    }
  };

  const filterOptions = ['全部', ...groups];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">资源管理</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <Filter className="h-5 w-5" />
                {filterGroup}
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  {filterOptions.map((group) => (
                    <button
                      key={group}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setFilterGroup(group);
                        setIsFilterOpen(false);
                      }}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
            >
              <FileUp className="h-5 w-5" />
              上传资源
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索资源..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                {getResourceIcon(resource.type)}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">
                    上传时间：{new Date(resource.uploadedAt).toLocaleDateString()}
                  </span>
                  {resource.groupId && (
                    <>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                        {resource.groupId}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleDownload(resource)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {resource.type === 'link' ? '访问' : '下载'}
                </button>
                <button 
                  onClick={() => setEditingResource(resource)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDeleteResource(resource.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {filteredResources.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无{filterGroup === '全部' ? '' : `${filterGroup}的`}资源
            </div>
          )}
        </div>
      </div>

      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditResourceModal
        resource={editingResource}
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
      />
    </div>
  );
}