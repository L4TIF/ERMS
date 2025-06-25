import { useStore } from '../store/store';
import CreateAssignment from '../components/CreateAssignment';
import { useState } from 'react';
import { api } from '../services/api';

function EditProjectModal({ project, onClose, onSave }: { project: any, onClose: () => void, onSave: () => void }) {
    const [form, setForm] = useState({
        name: project.name,
        description: project.description,
        status: project.status,
        requiredSkills: project.requiredSkills?.join(', ') || '',
        teamSize: project.teamSize,
        startDate: project.startDate ? project.startDate.slice(0, 10) : '',
        endDate: project.endDate ? project.endDate.slice(0, 10) : '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.updateProject(project._id, {
                name: form.name,
                description: form.description,
                status: form.status,
                requiredSkills: form.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean),
                teamSize: Number(form.teamSize),
                startDate: form.startDate,
                endDate: form.endDate,
            });
            onSave();
            onClose();
        } catch (err) {
            setError('Failed to update project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
                        <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                        <input name="teamSize" type="number" value={form.teamSize} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CreateProjectModal({ onClose, onSave }: { onClose: () => void, onSave: () => void }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        status: 'planning',
        requiredSkills: '',
        teamSize: 1,
        startDate: '',
        endDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.createProject({
                name: form.name,
                description: form.description,
                status: form.status as 'planning' | 'active' | 'completed',
                requiredSkills: form.requiredSkills.split(',').map((s: string) => s.trim()).filter(Boolean),
                teamSize: Number(form.teamSize),
                startDate: form.startDate,
                endDate: form.endDate,
            });
            onSave();
            onClose();
        } catch (err) {
            setError('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="planning">Planning</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
                        <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                        <input name="teamSize" type="number" value={form.teamSize} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ManagerDashboard() {
    const {
        currentUser,
        users,
        projects,
        assignments,
       
        fetchAssignments,
        getEngineers,
        logout,
        loading,
        fetchProjects
    } = useStore();

    const [showCreateAssignment, setShowCreateAssignment] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
    const [editProject, setEditProject] = useState<any | null>(null);
    const [showCreateProject, setShowCreateProject] = useState(false);

    // Wait for currentUser to be loaded
    if (!currentUser || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const engineers = getEngineers();

    const getUserAssignments = (userId: string) => {
        return assignments.filter(a => a.engineerId === userId);
    };

    const getTotalAllocation = (userId: string) => {
        const userAssignments = getUserAssignments(userId);
        return userAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
    };

    const handleAssignmentCreated = () => {
        fetchAssignments();
    };

    // Delete project handler
    const handleDeleteProject = async (projectId: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        setDeletingProjectId(projectId);
        try {
            await api.deleteProject(projectId);
            await fetchProjects();
            await fetchAssignments();
        } catch (err) {
            alert('Failed to delete project');
        } finally {
            setDeletingProjectId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                        <p className="text-gray-600">Welcome, {currentUser?.name}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setShowCreateProject(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Create Project
                        </button>
                        <button
                            onClick={() => setShowCreateAssignment(true)}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Assignment
                        </button>
                        <button
                            onClick={logout}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Team Overview */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {engineers.map((engineer) => {
                            const totalAllocation = getTotalAllocation(engineer._id);
                            const available = (engineer.maxCapacity || 100) - totalAllocation;

                            return (
                                <div key={engineer._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-medium">{engineer.name}</h3>
                                            <p className="text-sm text-gray-500">{engineer.seniority} • {engineer.department}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded ${available > 20 ? 'bg-green-100 text-green-800' :
                                                available > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {available}% available
                                        </span>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${totalAllocation}%` }}
                                        ></div>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Skills: {engineer.skills?.join(', ')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Projects */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Projects</h2>
                    <div className="space-y-4">
                        {projects.map((project) => (
                            <div key={project._id} className="border rounded-lg p-4 flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium">{project.name}</h3>
                                    <p className="text-sm text-gray-600">{project.description}</p>
                                    <p className="text-sm text-gray-500">
                                        Required: {project.requiredSkills?.join(', ')}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <span className={`px-2 py-1 text-xs rounded ${
                                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {project.status}
                                    </span>
                                    <button
                                        onClick={() => setEditProject(project)}
                                        className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProject(project._id)}
                                        disabled={deletingProjectId === project._id}
                                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs disabled:opacity-50"
                                    >
                                        {deletingProjectId === project._id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {editProject && (
                        <EditProjectModal
                            project={editProject}
                            onClose={() => setEditProject(null)}
                            onSave={fetchProjects}
                        />
                    )}
                </div>

                {/* Assignments */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
                    <div className="space-y-4">
                        {assignments.map((assignment) => {
                            const engineer = users.find(u => u._id === assignment.engineerId);
                            const project = projects.find(p => p._id === assignment.projectId);

                            return (
                                <div key={assignment._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{engineer?.name} → {project?.name}</p>
                                            <p className="text-sm text-gray-600">{assignment.role}</p>
                                        </div>
                                        <span className="text-sm font-medium text-blue-600">
                                            {assignment.allocationPercentage}% allocated
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showCreateAssignment && (
                <CreateAssignment
                    onClose={() => setShowCreateAssignment(false)}
                    onSuccess={handleAssignmentCreated}
                />
            )}
            {showCreateProject && (
                <CreateProjectModal
                    onClose={() => setShowCreateProject(false)}
                    onSave={fetchProjects}
                />
            )}
        </div>
    );
} 