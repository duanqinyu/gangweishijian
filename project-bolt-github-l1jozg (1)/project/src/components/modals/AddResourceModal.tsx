import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Resource } from '../../types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (resource: Omit<Resource, 'id'>) => void;
}

export default function AddResourceModal({ isOpen, onClose, onAdd }: AddResourceModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'document' | 'link'>('document');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title,
      type,
      url,
      uploadedAt: new Date(),
    });
    setTitle('');
    setType('document');
    setUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">上传资源</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">资源名称</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">资源类型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'document' | 'link')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="document">文件</option>
                <option value="link">链接</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {type === 'link' ? '链接地址' : '文件链接'}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder={type === 'link' ? 'https://example.com' : 'https://example.com/file.pdf'}
                required
              />
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
              上传
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}