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

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setFormData({
      title: file.name.split('.')[0],
      type: 'file',
      url: `downloads/${file.name}`
    });
  };

  const saveFile = async (file: File): Promise<boolean> => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const downloadsDir = path.join(process.cwd(), 'downloads');
      try {
        await fs.access(downloadsDir);
      } catch {
        await fs.mkdir(downloadsDir, { recursive: true });
      }
      
      const filePath = path.join(downloadsDir, file.name);
      await fs.writeFile(filePath, buffer);
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.type === 'file' && selectedFile) {
      setUploading(true);
      try {
        const success = await saveFile(selectedFile);
        if (success) {
          await addResource({
            title: formData.title,
            type: 'file',
            url: `downloads/${selectedFile.name}`
          });
          onClose();
        } else {
          alert('文件保存失败，请重试');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('上传过程中发生错误，请重试');
      } finally {
        setUploading(false);
      }
    } else if (formData.type === 'link') {
      await addResource(formData);
      onClose();
    }

    setFormData({
      title: '',
      type: 'link',
      url: ''
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                资源类型
              </label>
              <select
                required
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={formData.type}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    type: e.target.value as Resource['type'],
                    url: ''
                  });
                  setSelectedFile(null);
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
                disabled={uploading}
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
              disabled={uploading || (formData.type === 'file' ? !selectedFile : !formData.url)}
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