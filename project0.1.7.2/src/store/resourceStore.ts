import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resource } from '../types';

interface ResourceState {
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'uploadedAt'>) => void;
  updateResource: (id: string, data: Partial<Omit<Resource, 'id' | 'uploadedAt'>>) => void;
  removeResource: (id: string) => void;
}

const ensureDownloadsDir = async () => {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const downloadsDir = path.join(process.cwd(), 'downloads');
    
    try {
      await fs.access(downloadsDir);
    } catch {
      await fs.mkdir(downloadsDir, { recursive: true });
    }
    
    return downloadsDir;
  } catch (error) {
    console.error('Error ensuring downloads directory:', error);
    return null;
  }
};

export const useResourceStore = create<ResourceState>()(
  persist(
    (set) => ({
      resources: [
        { id: '1', title: '课程大纲', type: 'link', url: 'https://example.com/syllabus', uploadedAt: new Date('2024-01-15') },
        { id: '2', title: '项目指南', type: 'file', url: 'downloads/guidelines.pdf', uploadedAt: new Date('2024-01-20') },
      ],
      addResource: async (resource) => {
        if (resource.type === 'file') {
          await ensureDownloadsDir();
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
      removeResource: async (id) =>
        set((state) => {
          const resource = state.resources.find(r => r.id === id);
          if (resource?.type === 'file') {
            (async () => {
              try {
                const fs = await import('fs/promises');
                const path = await import('path');
                const filePath = path.join(process.cwd(), resource.url);
                await fs.unlink(filePath);
              } catch (error) {
                console.error('Error deleting file:', error);
              }
            })();
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