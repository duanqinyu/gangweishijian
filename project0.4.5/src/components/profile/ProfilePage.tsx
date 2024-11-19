import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAccountStore } from '../../store/accountStore';
import { Camera, Mail, User, Lock, Upload, X } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateProfile, logout } = useAuthStore();
  const { accounts, updateAccount } = useAccountStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });

  // 获取当前用户的账户信息
  const currentAccount = accounts.find(acc => 
    acc.username === user?.username || 
    (acc.name === user?.name && acc.email === user?.email)
  );

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAccount) {
      updateAccount(currentAccount.id, {
        name: formData.name,
        email: formData.email
      });
    }
    updateProfile(formData);
    setIsEditing(false);
    setMessage({ type: 'success', content: '个人信息更新成功！' });
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', content: '两次输入的密码不一致！' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', content: '新密码长度至少6位！' });
      return;
    }

    if (!currentAccount) {
      setMessage({ type: 'error', content: '未找到账户信息！' });
      return;
    }

    // 更新账户密码
    updateAccount(currentAccount.id, { password: passwordData.newPassword });
    setMessage({ type: 'success', content: '密码修改成功！即将退出登录...' });
    
    // 3秒后自动退出登录并跳转
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 3000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', content: '请上传图片文件！' });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage({ type: 'error', content: '图片大小不能超过5MB！' });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        if (currentAccount) {
          updateAccount(currentAccount.id, { avatar: base64String });
          updateProfile({ ...user!, avatar: base64String });
          setMessage({ type: 'success', content: '头像更新成功！' });
        }
        setIsUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({ type: 'error', content: '头像上传失败，请重试！' });
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (currentAccount) {
      updateAccount(currentAccount.id, { avatar: undefined });
      updateProfile({ ...user!, avatar: undefined });
      setMessage({ type: 'success', content: '头像已移除！' });
    }
  };

  if (!user || !currentAccount) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">个人信息</h1>

      {message.content && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.content}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative">
              <div 
                className={`w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${
                  dragActive ? 'border-2 border-indigo-500' : ''
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {user.avatar ? (
                  <>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleRemoveAvatar}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transform translate-x-1/3 -translate-y-1/3"
                      title="移除头像"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
                disabled={isUploadingAvatar}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.role === 'admin' ? '管理员' : user.role === 'teacher' ? '教师' : '学生'}</p>
              <p className="text-sm text-gray-500 mt-1">点击相机图标或拖拽图片到头像处更换头像</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  昵称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  当前密码
                </label>
                <input
                  type="text"
                  value={currentAccount.password}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  保存
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">昵称：</span>
                <span className="ml-2">{user.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">邮箱：</span>
                <span className="ml-2">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-gray-600">当前密码：</span>
                <span className="ml-2">{currentAccount.password}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                编辑信息
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">修改密码</h3>
            {isChangingPassword ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    当前密码
                  </label>
                  <input
                    type="text"
                    value={currentAccount.password}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密码
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({ newPassword: '', confirmPassword: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    更新密码
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <Lock className="w-4 h-4 mr-2" />
                修改密码
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}