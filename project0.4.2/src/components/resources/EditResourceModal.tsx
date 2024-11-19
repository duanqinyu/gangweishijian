import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useResourceStore } from '../../store/resourceStore';
import { useGroupStore } from '../../store/groupStore';
import type { Resource } from '../../types';

interface EditResourceModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditResourceModal({ resource, isOpen, onClose }: EditResourceModalProps) {
  const { updateResource } = useResourceStore();
  const { groups } = useGroupStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    groupId: '',
    url: '',
    fileData: '',
    type: 'link' as Resource['type']
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description || '',
        groupId: resource.groupId || '',
        url: resource.url,
        fileData: resource.fileData || '',
        type: resource.type
      });
    }
  }, [resource]);

  if (!isOpen || !resource) return null;

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

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      url: file.name
    }));

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          fileData: base64String
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('文件读取失败，请重试');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const updateData: Partial<Resource> = {
        title: formData.title,
        description: formData.description,
        groupId: formData.groupId
      };

      if (resource.type === 'file') {
        if (formData.fileData) {
          updateData.url = selectedFile?.name || resource.url;
          updateData.fileData = formData.fileData;
        }
      } else {
        updateData.url = formData.url;
      }

      await updateResource(resource.id, updateData);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      alert('更新失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">编辑资源</h2>
          <button 
            onClick={onClose}
            disabled={uploading}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源标题
              </label>
              <input
                type="text"
                required
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源简介
              </label>
              <textarea
                maxLength={150}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="请输入资源简介（最多150字）"
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {formData.description.length}/150
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所属小组
              </label>
              <select
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
              >
                <option value="">不属于任何小组</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {resource.type === 'link' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  资源链接
                </label>
                <input
                  type="url"
                  required
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  更新文件
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                  } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onDragEnter={!uploading ? handleDrag : undefined}
                  onDragLeave={!uploading ? handleDrag : undefined}
                  onDragOver={!uploading ? handleDrag : undefined}
                  onDrop={!uploading ? handleDrop : undefined}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    disabled={uploading}
                  />
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {uploading ? '正在上传...' : (
                      <>
                        拖拽文件到此处或
                        <button
                          type="button"
                          disabled={uploading}
                          className="text-indigo-600 hover:text-indigo-500 mx-1"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          浏览本地文件
                        </button>
                        更新
                      </>
                    )}
                  </p>
                  {selectedFile ? (
                    <p className="mt-2 text-sm text-gray-500">
                      已选择: {selectedFile.name}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      当前文件: {resource.url}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {uploading ? '更新中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}