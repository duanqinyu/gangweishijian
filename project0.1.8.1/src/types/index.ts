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
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Activity {
  id: string;
  type: 'student' | 'project' | 'resource';
  action: 'create' | 'update' | 'delete';
  targetId: string;
  targetName: string;
  timestamp: Date;
  path: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student';
}