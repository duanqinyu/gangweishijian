import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // Updated to use relative path
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

export const register = (data: {
  username: string;
  password: string;
  role: string;
  name?: string;
  email?: string;
}) => api.post('/auth/register', data);

// Users API
export const getUsers = () => api.get('/users');

export const updateUser = (id: string, data: any) =>
  api.put(`/users/${id}`, data);

// Projects API
export const getProjects = () => api.get('/projects');

export const createProject = (data: {
  name: string;
  description: string;
  gitRepo?: string;
  groupId: string;
}) => api.post('/projects', data);

export const updateProject = (id: string, data: any) =>
  api.put(`/projects/${id}`, data);

export const deleteProject = (id: string) =>
  api.delete(`/projects/${id}`);

// Resources API
export const getResources = () => api.get('/resources');

export const createResource = (data: any) =>
  api.post('/resources', data);

export const updateResource = (id: string, data: any) =>
  api.put(`/resources/${id}`, data);

export const deleteResource = (id: string) =>
  api.delete(`/resources/${id}`);

// Presentations API
export const getPresentations = () => api.get('/presentations');

export const createPresentation = (data: any) =>
  api.post('/presentations', data);

export const updatePresentation = (id: string, data: any) =>
  api.put(`/presentations/${id}`, data);

export const deletePresentation = (id: string) =>
  api.delete(`/presentations/${id}`);