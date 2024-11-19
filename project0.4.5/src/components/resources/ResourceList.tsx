import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Link as LinkIcon, FileUp, FileImage, FileCode, FileArchive, FileAudio, FileVideo } from 'lucide-react';
import { useResourceStore } from '../../store/resourceStore';
import { useGroupStore } from '../../store/groupStore';
import AddResourceModal from './AddResourceModal';
import EditResourceModal from './EditResourceModal';
import type { Resource } from '../../types';

// 自定义文件类型图标组件
const FileIcon = ({ className = "h-8 w-8", type }: { className?: string, type: string }) => {
  // 基础样式
  const baseStyle = `${className} flex-shrink-0`;
  
  // 根据文件类型返回对应的SVG图标
  switch (type) {
    case 'DOCX':
    case 'DOC':
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#4285F4"/>
          <path d="M14 2L20 8H14V2Z" fill="#A1C4FA"/>
          <path d="M8 13H16V14.5H8V13ZM8 16H16V17.5H8V16ZM8 10H16V11.5H8V10Z" fill="white"/>
        </svg>
      );
    case 'XLSX':
    case 'XLS':
    case 'CSV':
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#0F9D58"/>
          <path d="M14 2L20 8H14V2Z" fill="#87CEAC"/>
          <path d="M8 10H16M8 14H16M8 18H16M12 10V18M16 10V18" stroke="white" strokeWidth="1.5"/>
        </svg>
      );
    case 'PPTX':
    case 'PPT':
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#FF5722"/>
          <path d="M14 2L20 8H14V2Z" fill="#FFCCBC"/>
          <text x="8" y="16" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">PPT.</text>
        </svg>
      );
    case 'PDF':
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#E53935"/>
          <path d="M14 2L20 8H14V2Z" fill="#FFCDD2"/>
          <text x="9" y="16" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">P</text>
        </svg>
      );
    case 'TXT':
    case 'MD':
    case 'RTF':
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#607D8B"/>
          <path d="M14 2L20 8H14V2Z" fill="#B0BEC5"/>
          <path d="M8 12H16M8 15H16" stroke="white" strokeWidth="1.5"/>
        </svg>
      );
    default:
      return null;
  }
};

export default function ResourceList() {
  const { resources, removeResource } = useResourceStore();
  const { groups } = useGroupStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('全部');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const getResourceTypeInfo = (type: Resource['type'], fileName?: string) => {
    if (type === 'link') {
      return {
        icon: <LinkIcon className="h-8 w-8 text-green-600" />,
        label: '链接',
        labelClass: 'bg-green-100 text-green-800'
      };
    }

    // 如果是文件类型，根据文件扩展名判断
    if (fileName) {
      const extension = fileName.split('.').pop()?.toLowerCase();
      
      // Word文档
      if (['doc', 'docx'].includes(extension || '')) {
        return {
          icon: <FileIcon type={extension?.toUpperCase() || 'DOCX'} />,
          label: extension?.toUpperCase() || 'WORD',
          labelClass: 'bg-blue-100 text-blue-800'
        };
      }
      
      // PDF文档
      if (extension === 'pdf') {
        return {
          icon: <FileIcon type="PDF" />,
          label: 'PDF',
          labelClass: 'bg-red-100 text-red-800'
        };
      }
      
      // PowerPoint文档
      if (['ppt', 'pptx'].includes(extension || '')) {
        return {
          icon: <FileIcon type={extension?.toUpperCase() || 'PPT'} />,
          label: extension?.toUpperCase() || 'PPT',
          labelClass: 'bg-orange-100 text-orange-800'
        };
      }
      
      // Excel文档
      if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
        return {
          icon: <FileIcon type={extension?.toUpperCase() || 'XLSX'} />,
          label: extension?.toUpperCase() || 'EXCEL',
          labelClass: 'bg-emerald-100 text-emerald-800'
        };
      }
      
      // 文本文件
      if (['txt', 'md', 'rtf'].includes(extension || '')) {
        return {
          icon: <FileIcon type={extension?.toUpperCase() || 'TXT'} />,
          label: extension?.toUpperCase() || 'TEXT',
          labelClass: 'bg-gray-100 text-gray-800'
        };
      }
      
      // 图片文件
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension || '')) {
        return {
          icon: <FileImage className="h-8 w-8 text-purple-600" />,
          label: extension?.toUpperCase() || 'IMAGE',
          labelClass: 'bg-purple-100 text-purple-800'
        };
      }
      
      // 代码文件
      if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'c', 'php'].includes(extension || '')) {
        return {
          icon: <FileCode className="h-8 w-8 text-indigo-600" />,
          label: extension?.toUpperCase() || 'CODE',
          labelClass: 'bg-indigo-100 text-indigo-800'
        };
      }
      
      // 压缩文件
      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')) {
        return {
          icon: <FileArchive className="h-8 w-8 text-yellow-600" />,
          label: extension?.toUpperCase() || 'ARCHIVE',
          labelClass: 'bg-yellow-100 text-yellow-800'
        };
      }
      
      // 音频文件
      if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) {
        return {
          icon: <FileAudio className="h-8 w-8 text-pink-600" />,
          label: extension?.toUpperCase() || 'AUDIO',
          labelClass: 'bg-pink-100 text-pink-800'
        };
      }
      
      // 视频文件
      if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) {
        return {
          icon: <FileVideo className="h-8 w-8 text-rose-600" />,
          label: extension?.toUpperCase() || 'VIDEO',
          labelClass: 'bg-rose-100 text-rose-800'
        };
      }
    }
    
    // 默认文档图标
    return {
      icon: <FileIcon type="TXT" />,
      label: 'FILE',
      labelClass: 'bg-gray-100 text-gray-800'
    };
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === '全部' || resource.groupId === filterGroup;
    return matchesSearch && matchesGroup;
  });

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
                      <span className={`px-2 py-1 rounded-full ${resourceTypeInfo.labelClass}`}>
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