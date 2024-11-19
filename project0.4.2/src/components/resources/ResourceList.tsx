import React, { useState } from 'react';
import { Search, FileText, Filter, Edit2, Trash2, Link as LinkIcon, FileUp, FileImage, FileCode, FileSpreadsheet, FileArchive, FileAudio, FileVideo } from 'lucide-react';
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

  const getResourceTypeInfo = (type: Resource['type'], fileName?: string) => {
    if (type === 'link') {
      return {
        icon: <LinkIcon className="h-8 w-8 text-green-600" />,
        label: '链接'
      };
    }

    // 如果是文件类型，根据文件扩展名判断
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      // Word文档
      if (['doc', 'docx'].includes(extension || '')) {
        return {
          icon: <FileText className="h-8 w-8 text-blue-600" />,
          label: extension?.toUpperCase() || 'WORD'
        };
      }
      
      // PDF文档
      if (extension === 'pdf') {
        return {
          icon: <FileText className="h-8 w-8 text-red-500" />,
          label: 'PDF'
        };
      }
      
      // PowerPoint文档
      if (['ppt', 'pptx'].includes(extension || '')) {
        return {
          icon: <FileText className="h-8 w-8 text-orange-500" />,
          label: extension?.toUpperCase() || 'PPT'
        };
      }
      
      // Excel文档
      if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
        return {
          icon: <FileSpreadsheet className="h-8 w-8 text-green-600" />,
          label: extension?.toUpperCase() || 'EXCEL'
        };
      }
      
      // 文本文件
      if (['txt', 'md', 'rtf'].includes(extension || '')) {
        return {
          icon: <FileText className="h-8 w-8 text-gray-500" />,
          label: extension?.toUpperCase() || 'TEXT'
        };
      }
      
      // 图片文件
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
        return {
          icon: <FileImage className="h-8 w-8 text-purple-600" />,
          label: extension?.toUpperCase() || 'IMAGE'
        };
      }
      
      // 代码文件
      if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'c', 'php'].includes(extension || '')) {
        return {
          icon: <FileCode className="h-8 w-8 text-blue-600" />,
          label: extension?.toUpperCase() || 'CODE'
        };
      }
      
      // 压缩文件
      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
        return {
          icon: <FileArchive className="h-8 w-8 text-orange-600" />,
          label: extension?.toUpperCase() || 'ARCHIVE'
        };
      }
      
      // 音频文件
      if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) {
        return {
          icon: <FileAudio className="h-8 w-8 text-pink-600" />,
          label: extension?.toUpperCase() || 'AUDIO'
        };
      }
      
      // 视频文件
      if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
        return {
          icon: <FileVideo className="h-8 w-8 text-red-600" />,
          label: extension?.toUpperCase() || 'VIDEO'
        };
      }
    }
    
    // 默认文档图标
    return {
      icon: <FileText className="h-8 w-8 text-indigo-600" />,
      label: 'FILE'
    };
  };

  const handleDeleteResource = (id: string) => {
    if (window.confirm('确定要删除这个资源吗？')) {
      removeResource(id);
    }
  };

  const handleDownload = (resource: Resource) => {
    if (resource.type === 'file' && resource.fileData) {
      const link = document.createElement('a');
      link.href = resource.fileData;
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resource.type === 'link') {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const resourceTypeInfo = getResourceTypeInfo(resource.type, resource.url);
            return (
              <div key={resource.id} className="flex flex-col border rounded-lg hover:shadow-md transition-shadow">
                <div className="p-4 flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {resourceTypeInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {resource.description || '暂无简介'}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>上传时间：{new Date(resource.uploadedAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                        {resourceTypeInfo.label}
                      </span>
                      {resource.groupId && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                            {resource.groupId}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-auto border-t px-4 py-3 flex items-center justify-end gap-4">
                  <button
                    onClick={() => handleDownload(resource)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
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
            );
          })}

          {filteredResources.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-500">
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