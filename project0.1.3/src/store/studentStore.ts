import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Student } from '../types';

interface StudentState {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Omit<Student, 'id'>>) => void;
  removeStudent: (id: string) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      students: [
        { id: '1', name: '张三', email: 'zhangsan@example.com', group: '第一组' },
        { id: '2', name: '李四', email: 'lisi@example.com', group: '第二组' },
        { id: '3', name: '王五', email: 'wangwu@example.com', group: '第一组' },
      ],
      addStudent: (student) => 
        set((state) => ({
          students: [...state.students, { ...student, id: Date.now().toString() }]
        })),
      updateStudent: (id, data) =>
        set((state) => ({
          students: state.students.map(student =>
            student.id === id ? { ...student, ...data } : student
          )
        })),
      removeStudent: (id) =>
        set((state) => ({
          students: state.students.filter(student => student.id !== id)
        })),
    }),
    {
      name: 'student-storage',
    }
  )
);