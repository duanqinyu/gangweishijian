import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import AddPresentationModal from './AddPresentationModal';
import EditPresentationModal from './EditPresentationModal';
import type { Presentation } from '../../types';

export default function PresentationList() {
  const { presentations, removePresentation } = usePresentationStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<Presentation | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Presentation['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Presentation['status']) => {
    switch (status) {
      case 'upcoming':
        return '即将开始';
      case 'ongoing':
        return '进行中';
      case 'completed':
        return '已完成';
    }
  };

  const handleDeletePresentation = (id: string) => {
    if (window.confirm('确定要删除这个展示吗？')) {
      removePresentation(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">项目展示</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            安排展示
          </button>
        </div>

        <div className="grid gap-6">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {presentation.projectName}
                  </h3>
                  <p className="mt-1 text-gray-600">{presentation.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingPresentation(presentation)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePresentation(presentation.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-5 w-5 mr-2" />
                  {formatDate(presentation.startTime)}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(presentation.status)}`}>
                  {getStatusText(presentation.status)}
                </span>
              </div>
            </div>
          ))}
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