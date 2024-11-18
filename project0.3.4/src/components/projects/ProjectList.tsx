import React, { useState } from 'react';
import { Search, FolderGit2, Filter, Edit2, Trash2 } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useGroupStore } from '../../store/groupStore';
import AddProjectModal from './AddProjectModal';
import EditProjectModal from './EditProjectModal';
import type { Project } from '../../types';

export default function ProjectList() {
  const { projects, addProject, removeProject, updateProject } = useProjectStore();
  const { groups } = useGroupStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('全部');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // 获取所有项目中使用的组别
  const projectGroups = [...new Set(projects.map(project => project.groupId))];
  // 合并现有组别和项目中的组别，确保不重复
  const allGroups = ['全部', ...new Set([...groups, ...projectGroups])];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === '全部' || project.groupId === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const handleDeleteProject = (id: string) => {
    if (window.confirm('确定要删除这个项目吗？')) {
      removeProject(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">项目管理</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
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
                {allGroups.map((group) => (
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
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingProject(project)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{project.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {project.groupId}
                </span>
                {project.gitRepo && (
                  <a
                    href={project.gitRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    查看仓库
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addProject}
      />

      <EditProjectModal
        project={editingProject}
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={(data) => {
          if (editingProject) {
            updateProject(editingProject.id, data);
          }
        }}
      />
    </div>
  );
}