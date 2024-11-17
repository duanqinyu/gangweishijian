import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useGroupStore } from '../../store/groupStore';
import { usePresentationStore } from '../../store/presentationStore';

interface AddPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPresentationModal({ isOpen, onClose }: AddPresentationModalProps) {
  const { projects } = useProjectStore();
  const { groups } = useGroupStore();
  const { addPresentation } = usePresentationStore();
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || '',
    groupId: groups[0] || '',
    scheduledTime: new Date().toISOString().slice(0, 16),
    status: 'scheduled' as const
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPresentation({
      ...formData,
      scheduledTime: new Date(formData.scheduledTime)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">添加展示安排</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                小组
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              >
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                展示时间
              </label>
              <input
                type="datetime-local"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}