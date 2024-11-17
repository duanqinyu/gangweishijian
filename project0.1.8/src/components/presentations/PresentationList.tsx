import React, { useState } from 'react';
import { Calendar, Search, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import { useProjectStore } from '../../store/projectStore';
import AddPresentationModal from './AddPresentationModal';
import EditPresentationModal from './EditPresentationModal';
import type { Presentation } from '../../types';

export default function PresentationList() {
  const { presentations, removePresentation } = usePresentationStore();
  const { projects, updateProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<Presentation | null>(null);
  const [editingProjectName, setEditingProjectName] = useState<{id: string, name: string} | null>(null);

  const filteredPresentations = presentations
    .filter(presentation => {
      const project = projects.find(p => p.id === presentation.projectId);
      return project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             presentation.groupId.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || '未知项目';
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeletePresentation = (id: string) => {
    if (window.confirm('确定要删除这个展示安排吗？')) {
      removePresentation(id);
    }
  };

  const handleProjectNameEdit = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProjectName({ id: projectId, name: project.name });
    }
  };

  const handleProjectNameSave = () => {
    if (editingProjectName) {
      updateProject(editingProjectName.id, { name: editingProjectName.name });
      setEditingProjectName(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">展示安排</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            添加展示
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索项目或小组..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredPresentations.map((presentation) => (
            <div 
              key={presentation.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  {editingProjectName?.id === presentation.projectId ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingProjectName.name}
                        onChange={(e) => setEditingProjectName({ ...editingProjectName, name: e.target.value })}
                        className="text-lg font-medium border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleProjectNameSave}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingProjectName(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {getProjectName(presentation.projectId)}
                      </h3>
                      <button
                        onClick={() => handleProjectNameEdit(presentation.projectId)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    {presentation.groupId} · {formatDateTime(presentation.scheduledTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingPresentation(presentation)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeletePresentation(presentation.id)}
                  className="p-2 text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          
          {filteredPresentations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              暂无展示安排
            </div>
          )}
        </div>
      </div>

      <AddPresentationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditPresentationModal
        presentation={editingPresentation}
        isOpen={!!editingPresentation}
        onClose={() => setEditingPresentation(null)}
      />
    </div>
  );
}