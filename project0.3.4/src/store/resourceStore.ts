import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useActivityStore } from './activityStore';
import { useAuthStore } from './authStore';
import type { Resource } from '../types';

interface ResourceState {
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'uploadedAt'>) => void;
  updateResource: (id: string, data: Partial<Omit<Resource, 'id' | 'uploadedAt'>>) => void;
  removeResource: (id: string) => void;
}

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
        const newResource = { 
          ...resource, 
          id: Date.now().toString(),
          uploadedAt: new Date()
        };
        set((state) => ({
          resources: [...state.resources, newResource]
        }));
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role !== 'student') {
          useActivityStore.getState().addActivity({
            type: 'resource',
            action: 'create',
            targetId: newResource.id,
            targetName: newResource.title,
            path: '/resources'
          });
        }
      },
      updateResource: (id, data) => {
        set((state) => ({
          resources: state.resources.map(resource =>
            resource.id === id ? { ...resource, ...data } : resource
          )
        }));
        const resource = useResourceStore.getState().resources.find(r => r.id === id);
        const currentUser = useAuthStore.getState().user;
        if (resource && currentUser?.role !== 'student') {
          useActivityStore.getState().addActivity({
            type: 'resource',
            action: 'update',
            targetId: id,
            targetName: resource.title,
            path: '/resources'
          });
        }
      },
      removeResource: async (id) => {
        const resource = useResourceStore.getState().resources.find(r => r.id === id);
        set((state) => ({
          resources: state.resources.filter(resource => resource.id !== id)
        }));
        const currentUser = useAuthStore.getState().user;
        if (resource && currentUser?.role !== 'student') {
          useActivityStore.getState().addActivity({
            type: 'resource',
            action: 'delete',
            targetId: id,
            targetName: resource.title,
            path: '/resources'
          });
          if (resource.type === 'file') {
            try {
              const fs = await import('fs/promises');
              const path = await import('path');
              const filePath = path.join(process.cwd(), resource.url);
              await fs.unlink(filePath);
            } catch (error) {
              console.error('Error deleting file:', error);
            }
          }
        }
      },
    }),
    {
      name: 'resource-storage',
    }
  )
);