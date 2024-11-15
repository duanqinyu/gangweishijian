import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resource } from '../types';

interface ResourceState {
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'uploadedAt'>) => void;
  updateResource: (id: string, data: Partial<Omit<Resource, 'id' | 'uploadedAt'>>) => void;
  removeResource: (id: string) => void;
}

// 确保下载目录存在
const ensureDownloadsDir = () => {
  const fs = window.require('fs');
  const path = window.require('path');
  const downloadsPath = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads');
  
  if (!fs.existsSync(downloadsPath)) {
    fs.mkdirSync(downloadsPath, { recursive: true });
  }
  
  return downloadsPath;
};

export const useResourceStore = create<ResourceState>()(
  persist(
    (set) => ({
      resources: [
        { id: '1', title: '课程大纲', type: 'link', url: 'https://example.com/syllabus', uploadedAt: new Date('2024-01-15') },
        { id: '2', title: '项目指南', type: 'file', url: 'downloads/guidelines.pdf', uploadedAt: new Date('2024-01-20') },
      ],
      addResource: (resource) => {
        if (resource.type === 'file') {
          const fs = window.require('fs');
          const path = window.require('path');
          const downloadsPath = ensureDownloadsDir();
          
          // 如果是文件类型，复制文件到下载目录
          const fileName = path.basename(resource.url);
          const destPath = path.join(downloadsPath, fileName);
          fs.copyFileSync(resource.url, destPath);
          
          // 更新URL为相对路径
          resource.url = `downloads/${fileName}`;
        }
        
        set((state) => ({
          resources: [...state.resources, { 
            ...resource, 
            id: Date.now().toString(),
            uploadedAt: new Date()
          }]
        }));
      },
      updateResource: (id, data) =>
        set((state) => ({
          resources: state.resources.map(resource =>
            resource.id === id ? { ...resource, ...data } : resource
          )
        })),
      removeResource: (id) =>
        set((state) => {
          const resource = state.resources.find(r => r.id === id);
          if (resource?.type === 'file') {
            // 如果是文件类型，删除本地文件
            const fs = window.require('fs');
            const path = window.require('path');
            const downloadsPath = ensureDownloadsDir();
            const filePath = path.join(downloadsPath, path.basename(resource.url));
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          return {
            resources: state.resources.filter(resource => resource.id !== id)
          };
        }),
    }),
    {
      name: 'resource-storage',
    }
  )
);