import { create } from 'zustand';
import { api } from '../services/api';

// Types
interface User {
  _id: string;
  email: string;
  name: string;
  role: 'engineer' | 'manager';
  skills?: string[];
  seniority?: 'junior' | 'mid' | 'senior';
  maxCapacity?: number;
  department?: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  requiredSkills?: string[];
  teamSize?: number;
  status: 'planning' | 'active' | 'completed';
  managerId?: string;
}

interface Assignment {
  _id: string;
  engineerId: string;
  projectId: string;
  allocationPercentage: number;
  startDate?: string;
  endDate?: string;
  role?: string;
}

interface Store {
  // State
  users: User[];
  projects: Project[];
  assignments: Assignment[];
  currentUser: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  // Auth Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;

  // Data Actions
  fetchUsers: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchAssignments: () => Promise<void>;

  // Helper functions
  getEngineers: () => User[];
  getManagers: () => User[];
  getUserAssignments: (userId: string) => Assignment[];
}

export const useStore = create<Store>((set, get) => ({
    // State
    users: [],
    projects: [],
    assignments: [],
    currentUser: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,

    // Auth Actions
    login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
            const response = await api.login({ email, password });
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                set({ 
                    currentUser: response.user, 
                    token: response.token, 
                    loading: false 
                });
                
                // Fetch data after successful login
                try {
                    await Promise.all([
                        api.getUsers(),
                        api.getProjects(),
                        api.getAssignments()
                    ]).then(([users, projects, assignments]) => {
                        set({ users, projects, assignments });
                    });
                } catch (dataError) {
                    console.error('Error fetching initial data:', dataError);
                }
                
                return { success: true };
            } else {
                const errorMessage = (response as any).message || 'Login failed';
                set({ error: errorMessage, loading: false });
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            set({ error: 'Login failed', loading: false });
            return { success: false, error: 'Login failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ 
            currentUser: null, 
            token: null, 
            users: [], 
            projects: [], 
            assignments: [] 
        });
        // Redirect to login page
        window.location.href = '/login';
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const user = await api.getProfile();
            set({ currentUser: user, token });
            
            // Fetch data if user is already logged in
            try {
                await Promise.all([
                    api.getUsers(),
                    api.getProjects(),
                    api.getAssignments()
                ]).then(([users, projects, assignments]) => {
                    set({ users, projects, assignments });
                });
            } catch (dataError) {
                console.error('Error fetching data on auth check:', dataError);
            }
            
            return true;
        } catch (error) {
            localStorage.removeItem('token');
            set({ currentUser: null, token: null });
            return false;
        }
    },

    // Data Actions
    fetchUsers: async () => {
        set({ loading: true });
        try {
            const users = await api.getUsers();
            set({ users, loading: false });
        } catch (error) {
            console.error('Error fetching users:', error);
            set({ loading: false });
        }
    },

    fetchProjects: async () => {
        set({ loading: true });
        try {
            const projects = await api.getProjects();
            set({ projects, loading: false });
        } catch (error) {
            console.error('Error fetching projects:', error);
            set({ loading: false });
        }
    },

    fetchAssignments: async () => {
        set({ loading: true });
        try {
            const assignments = await api.getAssignments();
            console.log('Store: Fetched assignments:', assignments);
            set({ assignments, loading: false });
        } catch (error) {
            console.error('Error fetching assignments:', error);
            set({ loading: false });
        }
    },

    // Helper functions
    getEngineers: () => get().users.filter(user => user.role === 'engineer'),
    getManagers: () => get().users.filter(user => user.role === 'manager'),

    getUserAssignments: (userId: string) =>
        get().assignments.filter(assignment => assignment.engineerId === userId),
})); 