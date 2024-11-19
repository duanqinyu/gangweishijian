import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, FileText } from 'lucide-react';
import { useResourceStore } from '../../store/resourceStore';
import { useGroupStore } from '../../store/groupStore';
import type { Resource } from '../../types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddResourceModal({ isOpen, onClose }: AddResourceModalProps) {
  const { addResource } = useResourceStore();
  const { groups } = useGroupStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'link' as Resource['type'],
    url: '',
    fileData: '',
    description: '',
    groupId: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setFormData({
      ...formData,
      title: file.name.split('.')[0],
      type: 'file',
      url: file.name
    });

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
      if (formData.type === 'file') {
        if (!formData.fileData) {
          throw new Error('请先选择文件');
        }
        await addResource({
          title: formData.title,
          type: 'file',
          url: selectedFile?.name || '',
          fileData: formData.fileData,
          description: formData.description,
          groupId: formData.groupId
        });
      } else {
        await addResource({
          title: formData.title,
          type: 'link',
          url: formData.url,
          description: formData.description,
          groupId: formData.groupId
        });
      }
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }

    setFormData({
      title: '',
      type: 'link',
      url: '',
      fileData: '',
      description: '',
      groupId: ''
    });
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">添加资源</h2>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                资源类型
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    formData.type === 'link'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                  onClick={() => {
                    setFormData({ 
                      ...formData, 
                      type: 'link',
                      url: '',
                      fileData: ''
                    });
                    setSelectedFile(null);
                  }}
                  disabled={uploading}
                >
                  <LinkIcon className={`h-8 w-8 mb-2 ${
                    formData.type === 'link' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <span className={formData.type === 'link' ? 'font-medium' : ''}>链接资源</span>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                    formData.type === 'file'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                  onClick={() => {
                    setFormData({ 
                      ...formData, 
                      type: 'file',
                      url: '',
                      fileData: ''
                    });
                    setSelectedFile(null);
                  }}
                  disabled={uploading}
                >
                  <FileText className={`h-8 w-8 mb-2 ${
                    formData.type === 'file' ? 'text-indigo-600' : 'text-gray-400'
                  }`} />
                  <span className={formData.type === 'file' ? 'font-medium' : ''}>文件资源</span>
                </button>
              </div>
            </div>

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
            
            {formData.type === 'link' ? (
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
                    </>
                  )}
                </p>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    已选择: {selectedFile.name}
                  </p>
                )}
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
              disabled={uploading || (formData.type === 'file' ? !formData.fileData : !formData.url)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '上传中...' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}