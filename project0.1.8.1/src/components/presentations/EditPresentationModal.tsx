import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import type { Presentation } from '../../types';

interface EditPresentationModalProps {
  presentation: Presentation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPresentationModal({ presentation, isOpen, onClose }: EditPresentationModalProps) {
  const { updatePresentation } = usePresentationStore();
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    startTime: '',
    status: 'upcoming' as Presentation['status']
  });

  useEffect(() => {
    if (presentation) {
      setFormData({
        projectName: presentation.projectName,
        description: presentation.description,
        startTime: new Date(presentation.startTime).toISOString().slice(0, 16),
        status: presentation.status
      });
    }
  }, [presentation]);

  if (!isOpen || !presentation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePresentation(presentation.id, {
      ...formData,
      startTime: new Date(formData.startTime)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">编辑展示信息</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目名称
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                展示说明
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                开始时间
              </label>
              <input
                type="datetime-local"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Presentation['status'] })}
              >
                <option value="upcoming">即将开始</option>
                <option value="ongoing">进行中</option>
                <option value="completed">已完成</option>
              </select>
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
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}