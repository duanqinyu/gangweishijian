import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '../types';

interface ProjectState {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, data: Partial<Omit<Project, 'id'>>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [
        { id: '1', name: '电商平台', description: '构建全栈电商解决方案', gitRepo: 'https://github.com/example/ecommerce', groupId: '第一组' },
        { id: '2', name: '任务管理器', description: '协作任务管理应用', gitRepo: 'https://github.com/example/taskmanager', groupId: '第二组' },
        { id: '3', name: '作品集网站', description: '个人作品集网站模板', gitRepo: 'https://github.com/example/portfolio', groupId: '第三组' },
      ],
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: Date.now().toString() }]
        })),
      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id ? { ...project, ...data } : project
          )
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id)
        })),
    }),
    {
      name: 'project-storage',
    }
  )
);