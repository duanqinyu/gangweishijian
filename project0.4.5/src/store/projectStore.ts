import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useActivityStore } from './activityStore';
import { useAuthStore } from './authStore';
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
      addProject: (project) => {
        const newProject = { ...project, id: Date.now().toString() };
        set((state) => ({
          projects: [...state.projects, newProject]
        }));
        const currentUser = useAuthStore.getState().user;
        if (currentUser?.role !== 'student') {
          useActivityStore.getState().addActivity({
            type: 'project',
            action: 'create',
            targetId: newProject.id,
            targetName: newProject.name,
            path: '/projects'
          });
        }
      },
      updateProject: (id, data) => {
        set((state) => ({
          projects: state.projects.map(project =>
            project.id === id ? { ...project, ...data } : project
          )
        }));
        const project = useProjectStore.getState().projects.find(p => p.id === id);
        const currentUser = useAuthStore.getState().user;
        if (project && currentUser?.role !== 'student') {
          useActivityStore.getState().addActivity({
            type: 'project',
            action: 'update',
            targetId: id,
            targetName: project.name,
            path: '/projects'
          });
        }
      },
      removeProject: (id) => {
        const project = useProjectStore.getState().projects.find(p => p.id === id);
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id)
        }));
        const currentUser = useAuthStore.getState().user;
        if (project && currentUser?.role !== 'student') {
          useActivityStore.getState().addActivity({
            type: 'project',
            action: 'delete',
            targetId: id,
            targetName: project.name,
            path: '/projects'
          });
        }
      },
    }),
    {
      name: 'project-storage',
    }
  )
);