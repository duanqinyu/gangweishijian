import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAccountStore } from '../../store/accountStore';
import { Lock, Mail, User } from 'lucide-react';

// Helper function to safely encode token payload
const encodeTokenPayload = (payload: object) => {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
};

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    role: 'student' as 'admin' | 'teacher' | 'student'
  });
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const { accounts, addAccount, updateLastLogin } = useAccountStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      // 注册逻辑
      if (formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
      if (formData.password.length < 6) {
        setError('密码长度至少6位');
        return;
      }

      // 检查用户名是否已存在
      const existingAccount = accounts.find(acc => acc.username === formData.username);
      if (existingAccount) {
        setError('该用户名已被注册');
        return;
      }

      // 添加新账户
      const newAccount = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        name: formData.name,
        email: formData.email
      };
      
      addAccount(newAccount);

      // 自动登录并更新最后登录时间
      const account = accounts.find(acc => acc.username === formData.username);
      if (account) {
        updateLastLogin(account.id);
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodeTokenPayload({
          username: formData.username,
          role: formData.role,
          name: formData.name,
          email: formData.email
        })}`;
        login(mockToken);
        navigate('/');
      }
    } else {
      // 登录逻辑
      // 检查是否是管理员账号
      if (formData.username === 'admin' && formData.password === 'admin123') {
        const adminAccount = accounts.find(acc => acc.username === 'admin');
        if (adminAccount) {
          updateLastLogin(adminAccount.id);
        }
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodeTokenPayload({
          username: 'admin',
          role: 'admin',
          name: '管理员',
          email: 'admin@example.com'
        })}`;
        login(mockToken);
        navigate('/');
        return;
      }

      // 检查普通用户账号
      const account = accounts.find(acc => 
        acc.username === formData.username && acc.password === formData.password
      );

      if (account) {
        updateLastLogin(account.id);
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodeTokenPayload({
          username: account.username,
          role: account.role,
          name: account.name,
          email: account.email
        })}`;
        login(mockToken);
        navigate('/');
      } else {
        setError('用户名或密码错误');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? '登录系统' : '注册账号'}
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">姓名</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">邮箱</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="邮箱"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="username" className="sr-only">用户名</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">确认密码</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="确认密码"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    注册身份
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'teacher' | 'student' })}
                  >
                    <option value="student">学生</option>
                    <option value="teacher">教师</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? '登录' : '注册'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  username: '',
                  password: '',
                  confirmPassword: '',
                  name: '',
                  email: '',
                  role: 'student'
                });
              }}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}