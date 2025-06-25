import React, { useState } from 'react';
import { useStore } from '../store/store';
import { api } from '../services/api';

interface CreateAssignmentProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAssignment({ onClose, onSuccess }: CreateAssignmentProps) {
  const { users, projects, getEngineers } = useStore();
  const [engineerId, setEngineerId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [allocationPercentage, setAllocationPercentage] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const engineers = getEngineers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createAssignment({
        engineerId,
        projectId,
        allocationPercentage: parseInt(allocationPercentage),
        role: role || 'Developer'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      setError('Failed to create assignment');
      console.error('Error creating assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create Assignment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engineer
            </label>
            <select
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Engineer</option>
              {engineers.map((engineer) => (
                <option key={engineer._id} value={engineer._id}>
                  {engineer.name} ({engineer.seniority})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name} ({project.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allocation Percentage
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={allocationPercentage}
              onChange={(e) => setAllocationPercentage(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Developer, Tech Lead"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 