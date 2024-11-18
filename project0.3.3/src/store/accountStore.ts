import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useActivityStore } from './activityStore';
import type { UserAccount } from '../types';

interface AccountState {
  accounts: UserAccount[];
  addAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, data: Partial<Omit<UserAccount, 'id'>>) => void;
  removeAccount: (id: string) => void;
  updateLastLogin: (id: string) => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      accounts: [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date()
        },
        {
          id: '2',
          username: 'teacher1',
          password: 'teacher123',
          role: 'teacher',
          createdAt: new Date('2024-01-02')
        }
      ],
      addAccount: (account) => {
        const newAccount = {
          ...account,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount]
        }));
      },
      updateAccount: (id, data) => {
        set((state) => ({
          accounts: state.accounts.map(account =>
            account.id === id ? { ...account, ...data } : account
          )
        }));
      },
      removeAccount: (id) => {
        const account = useAccountStore.getState().accounts.find(a => a.id === id);
        if (account && account.role !== 'admin') {
          set((state) => ({
            accounts: state.accounts.filter(account => account.id !== id)
          }));
          useActivityStore.getState().addActivity({
            type: 'account',
            action: 'delete',
            targetId: id,
            targetName: account.username,
            path: '/accounts'
          });
        }
      },
      updateLastLogin: (id) => {
        set((state) => ({
          accounts: state.accounts.map(account =>
            account.id === id ? { ...account, lastLogin: new Date() } : account
          )
        }));
      }
    }),
    {
      name: 'account-storage',
    }
  )
);