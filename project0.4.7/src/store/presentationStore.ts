import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Presentation } from '../types';

interface PresentationState {
  presentations: Presentation[];
  addPresentation: (presentation: Omit<Presentation, 'id' | 'status'>) => void;
  updatePresentation: (id: string, data: Partial<Omit<Presentation, 'id'>>) => void;
  removePresentation: (id: string) => void;
  updatePresentationStatuses: () => void;
}

const calculateStatus = (startTime: Date, endTime: Date): Presentation['status'] => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'ongoing';
};

export const usePresentationStore = create<PresentationState>()(
  persist(
    (set, get) => ({
      presentations: [
        {
          id: '1',
          projectId: '1',
          projectName: '电商平台',
          description: '展示电商平台的核心功能和技术架构',
          startTime: new Date('2024-03-20T10:00:00'),
          endTime: new Date('2024-03-20T11:00:00'),
          status: 'upcoming',
          groupId: '第一组'
        },
        {
          id: '2',
          projectId: '2',
          projectName: '任务管理器',
          description: '演示任务管理系统的用户界面和协作功能',
          startTime: new Date('2024-03-21T14:30:00'),
          endTime: new Date('2024-03-21T15:30:00'),
          status: 'upcoming',
          groupId: '第二组'
        }
      ],
      addPresentation: (presentation) => {
        const newPresentation = {
          ...presentation,
          id: Date.now().toString(),
          status: calculateStatus(presentation.startTime, presentation.endTime)
        };
        set((state) => ({
          presentations: [...state.presentations, newPresentation]
        }));
      },
      updatePresentation: (id, data) => {
        set((state) => ({
          presentations: state.presentations.map(presentation =>
            presentation.id === id
              ? {
                  ...presentation,
                  ...data,
                  status: data.startTime && data.endTime
                    ? calculateStatus(data.startTime, data.endTime)
                    : presentation.status
                }
              : presentation
          )
        }));
      },
      removePresentation: (id) => {
        set((state) => ({
          presentations: state.presentations.filter(presentation => presentation.id !== id)
        }));
      },
      updatePresentationStatuses: () => {
        set((state) => ({
          presentations: state.presentations.map(presentation => ({
            ...presentation,
            status: calculateStatus(presentation.startTime, presentation.endTime)
          }))
        }));
      }
    }),
    {
      name: 'presentation-storage',
    }
  )
);