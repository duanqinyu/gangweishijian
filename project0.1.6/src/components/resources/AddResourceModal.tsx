import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useResourceStore } from '../../store/resourceStore';
import type { Resource } from '../../types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddResourceModal({ isOpen, onClose }: AddResourceModalProps) {
  const { addResource } = useResourceStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'link' as Resource['type'],
    url: ''
  });
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFormData({
      title: file.name.split('.')[0],
      type: 'file',
      url: file.path
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResource(formData);
    setFormData({
      title: '',
      type: 'link',
      url: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">添加资源</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源类型
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.type}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    type: e.target.value as Resource['type'],
                    url: '' // 清空URL当切换类型时
                  });
                }}
              >
                <option value="link">链接</option>
                <option value="file">文件</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源标题
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            {formData.type === 'link' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  资源链接
                </label>
                <input
                  type="url"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  拖拽文件到此处或
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-500 mx-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    浏览本地文件
                  </button>
                </p>
                {formData.url && (
                  <p className="mt-2 text-sm text-gray-500">
                    已选择: {formData.url.split('/').pop()}
                  </p>
                )}
              </div>
            )}
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
              disabled={!formData.url}
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}