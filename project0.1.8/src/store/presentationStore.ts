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
          groupId: '第一组',
          scheduledTime: new Date('2024-03-20T14:00:00'),
          status: 'scheduled'
        },
        {
          id: '2',
          projectId: '2',
          groupId: '第二组',
          scheduledTime: new Date('2024-03-22T14:00:00'),
          status: 'scheduled'
        },
        {
          id: '3',
          projectId: '3',
          groupId: '第三组',
          scheduledTime: new Date('2024-03-25T14:00:00'),
          status: 'scheduled'
        }
      ],
      addPresentation: (presentation) => {
        const newPresentation = {
          ...presentation,
          id: Date.now().toString()
        };
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