import { useStore } from '../store/store';


export default function EngineerDashboard() {
    const {
       currentUser,
        projects,
        assignments,
        getUserAssignments, 
        logout,
        loading,
    } =  useStore();


    console.log(currentUser);
    console.log(loading);
    // Show loading spinner until assignments are loaded
    if (!currentUser || loading || assignments.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }
   
    // Only show assignments for existing projects
    const validProjectIds = new Set(projects.map(p => p._id));
    const myAssignments = getUserAssignments(currentUser._id).filter(a => validProjectIds.has(a.projectId));
    const totalAllocation = myAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
    const available = (currentUser.maxCapacity || 100) - totalAllocation;
    

    console.log('EngineerDashboard Debug:', {
        currentUserId: currentUser._id,
        allAssignments: assignments,
        myAssignments,
        totalAllocation,
        available
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                        <p className="text-gray-600">Welcome, {currentUser?.name}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{currentUser?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{currentUser?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Seniority</p>
                            <p className="font-medium">{currentUser?.seniority}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="font-medium">{currentUser?.department}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Skills</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {currentUser?.skills?.map((skill) => (
                                    <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Capacity Overview */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">My Capacity</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Current Allocation</span>
                                <span className="text-sm font-medium">{totalAllocation}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-600 h-3 rounded-full"
                                    style={{ width: `${totalAllocation}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Available Capacity</span>
                            <span className={`text-sm font-medium ${available > 20 ? 'text-green-600' :
                                    available > 0 ? 'text-yellow-600' :
                                        'text-red-600'
                                }`}>
                                {available}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* My Assignments */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">My Assignments</h2>
                    {myAssignments.length === 0 ? (
                        <p className="text-gray-500">No assignments found.</p>
                    ) : (
                        <div className="space-y-4">
                            {myAssignments.map((assignment) => {
                                const project = projects.find(p => p._id === assignment.projectId);

                                return (
                                    <div key={assignment._id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{project?.name}</h3>
                                                <p className="text-sm text-gray-600">{project?.description}</p>
                                                <p className="text-sm text-gray-500">Role: {assignment.role}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-blue-600">
                                                    {assignment.allocationPercentage}% allocated
                                                </span>
                                                <p className="text-xs text-gray-500">
                                                    {assignment.startDate && new Date(assignment.startDate).toLocaleDateString()} - {assignment.endDate && new Date(assignment.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 