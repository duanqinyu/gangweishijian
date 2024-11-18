import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { useGroupStore } from '../../store/groupStore';

interface GroupManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupManageModal({ isOpen, onClose }: GroupManageModalProps) {
  const { groups, addGroup, removeGroup, updateGroup } = useGroupStore();
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState<{ name: string; newName: string } | null>(null);

  if (!isOpen) return null;

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
    }
  };

  const handleUpdateGroup = (oldName: string) => {
    if (editingGroup && editingGroup.newName.trim()) {
      updateGroup(oldName, editingGroup.newName.trim());
      setEditingGroup(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">管理小组</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleAddGroup} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="输入新组名"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              添加
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group} className="flex items-center justify-between p-3 border rounded-md">
              {editingGroup?.name === group ? (
                <input
                  type="text"
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 mr-2"
                  value={editingGroup.newName}
                  onChange={(e) => setEditingGroup({ ...editingGroup, newName: e.target.value })}
                  onBlur={() => handleUpdateGroup(group)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateGroup(group)}
                  autoFocus
                />
              ) : (
                <span className="text-gray-700">{group}</span>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (editingGroup?.name === group) {
                      handleUpdateGroup(group);
                    } else {
                      setEditingGroup({ name: group, newName: group });
                    }
                  }}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeGroup(group)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}