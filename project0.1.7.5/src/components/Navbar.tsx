import { Menu, UserCircle2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">课程管理系统</Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                  }`}
                >
                  仪表盘
                </Link>
                <Link 
                  to="/students" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/students') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                  }`}
                >
                  学生
                </Link>
                <Link 
                  to="/projects" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/projects') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                  }`}
                >
                  项目
                </Link>
                <Link 
                  to="/resources" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/resources') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
                  }`}
                >
                  资源
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center">
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-indigo-500 transition-colors"
                >
                  <UserCircle2 className="h-6 w-6" />
                  <span>{user?.name || '用户'}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      个人信息
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-indigo-500 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
              }`}
              onClick={() => setIsOpen(false)}
            >
              仪表盘
            </Link>
            <Link 
              to="/students" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/students') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
              }`}
              onClick={() => setIsOpen(false)}
            >
              学生
            </Link>
            <Link 
              to="/projects" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/projects') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
              }`}
              onClick={() => setIsOpen(false)}
            >
              项目
            </Link>
            <Link 
              to="/resources" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/resources') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
              }`}
              onClick={() => setIsOpen(false)}
            >
              资源
            </Link>
            <Link 
              to="/profile" 
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/profile') ? 'bg-indigo-700' : 'hover:bg-indigo-500'
              }`}
              onClick={() => setIsOpen(false)}
            >
              个人信息
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500"
            >
              退出登录
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}