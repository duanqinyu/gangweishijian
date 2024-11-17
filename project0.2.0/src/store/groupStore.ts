import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GroupState {
  groups: string[];
  addGroup: (group: string) => void;
  removeGroup: (group: string) => void;
  updateGroup: (oldName: string, newName: string) => void;
}

export const useGroupStore = create<GroupState>()(
  persist(
    (set) => ({
      groups: ['第一组', '第二组', '第三组', '第四组'],
      addGroup: (group) =>
        set((state) => ({
          groups: [...state.groups, group]
        })),
      removeGroup: (group) =>
        set((state) => ({
          groups: state.groups.filter((g) => g !== group)
        })),
      updateGroup: (oldName, newName) =>
        set((state) => ({
          groups: state.groups.map((g) => (g === oldName ? newName : g))
        })),
    }),
    {
      name: 'group-storage',
    }
  )
);