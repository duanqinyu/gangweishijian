import React, { useState } from 'react';
import { Search, FolderGit2, Filter, MoreVertical } from 'lucide-react';
import type { Project } from '../../types';

const mockProjects: Project[] = [
  { id: '1', name: 'E-commerce Platform', description: 'Building a full-stack e-commerce solution', gitRepo: 'https://github.com/example/ecommerce', groupId: 'G1' },
  { id: '2', name: 'Task Manager', description: 'A collaborative task management app', gitRepo: 'https://github.com/example/taskmanager', groupId: 'G2' },
  { id: '3', name: 'Portfolio Website', description: 'Personal portfolio website template', gitRepo: 'https://github.com/example/portfolio', groupId: 'G3' },
];

export default function ProjectList() {
  const [projects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <FolderGit2 className="h-5 w-5" />
            New Project
          </button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            Filter
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">{project.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  Group {project.groupId}
                </span>
                <a
                  href={project.gitRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View Repository
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}