import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface ManageGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groups: string[]) => void;
  currentGroups: string[];
}

export default function ManageGroupsModal({ isOpen, onClose, onSave, currentGroups }: ManageGroupsModalProps) {
  const [groups, setGroups] = useState<string[]>(currentGroups);
  const [newGroup, setNewGroup] = useState('');

  const handleAddGroup = () => {
    if (newGroup && !groups.includes(newGroup)) {
      setGroups([...groups, newGroup]);
      setNewGroup('');
    }
  };

  const handleRemoveGroup = (groupToRemove: string) => {
    setGroups(groups.filter(group => group !== groupToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(groups);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">管理小组</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="输入小组名称"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddGroup}
                className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {groups.map((group) => (
                <div key={group} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span>{group}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(group)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}