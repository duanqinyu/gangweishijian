export interface Student {
  id: string;
  name: string;
  email: string;
  group?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  groups: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  gitRepo?: string;
  groupId: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'file';
  url: string;
  uploadedAt: Date;
}

export interface Presentation {
  id: string;
  projectId: string;
  projectName: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  groupId: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  name?: string;
  email?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Activity {
  id: string;
  type: 'student' | 'project' | 'resource' | 'account';
  action: 'create' | 'update' | 'delete';
  targetId: string;
  targetName: string;
  timestamp: Date;
  path: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: string;
}