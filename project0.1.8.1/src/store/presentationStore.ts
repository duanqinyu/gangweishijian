import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Presentation } from '../types';

interface PresentationState {
  presentations: Presentation[];
  addPresentation: (presentation: Omit<Presentation, 'id'>) => void;
  updatePresentation: (id: string, data: Partial<Omit<Presentation, 'id'>>) => void;
  removePresentation: (id: string) => void;
}

export const usePresentationStore = create<PresentationState>()(
  persist(
    (set) => ({
      presentations: [
        {
          id: '1',
          projectId: '1',
          projectName: '电商平台',
          description: '展示电商平台的核心功能和技术架构',
          startTime: new Date('2024-03-20T10:00:00'),
          status: 'upcoming'
        },
        {
          id: '2',
          projectId: '2',
          projectName: '任务管理器',
          description: '演示任务管理系统的用户界面和协作功能',
          startTime: new Date('2024-03-21T14:30:00'),
          status: 'upcoming'
        }
      ],
      addPresentation: (presentation) => {
        const newPresentation = { ...presentation, id: Date.now().toString() };
        set((state) => ({
          presentations: [...state.presentations, newPresentation]
        }));
      },
      updatePresentation: (id, data) => {
        set((state) => ({
          presentations: state.presentations.map(presentation =>
            presentation.id === id ? { ...presentation, ...data } : presentation
          )
        }));
      },
      removePresentation: (id) => {
        set((state) => ({
          presentations: state.presentations.filter(presentation => presentation.id !== id)
        }));
      }
    }),
    {
      name: 'presentation-storage',
    }
  )
);