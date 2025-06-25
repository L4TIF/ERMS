
import { useStore } from '../store/store';
import CreateAssignment from '../components/CreateAssignment';

export default function ManagerDashboard() {
    const {
        currentUser,
        users,
        projects,
        assignments,
       
        fetchAssignments,
        getEngineers,
        logout,
        loading
    } = useStore();

    const [showCreateAssignment, setShowCreateAssignment] = useState(false);

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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                        <p className="text-gray-600">Welcome, {currentUser?.name}</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setShowCreateAssignment(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create Assignment
                        </button>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
                            <div key={project._id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{project.name}</h3>
                                        <p className="text-sm text-gray-600">{project.description}</p>
                                        <p className="text-sm text-gray-500">
                                            Required: {project.requiredSkills?.join(', ')}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                            project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
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
        </div>
    );
} 