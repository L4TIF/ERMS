const API_BASE_URL = 'http://localhost:5000/api';

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

interface LoginResponse {
  token: string;
  user: User;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

// Get token from localStorage
const getToken = (): string | null => localStorage.getItem('token');

// Add auth headers to requests
const authHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    console.log('Attempting login with:', credentials);
    console.log('API URL:', `${API_BASE_URL}/auth/login`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getProfile: async (): Promise<User> => 
    fetch(`${API_BASE_URL}/auth/profile`, {
      headers: authHeaders()
    }).then(res => res.json()),

  register: async (userData: Partial<User>): Promise<ApiResponse<User>> => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json()),

  // Users
  getUsers: async (): Promise<User[]> => 
    fetch(`${API_BASE_URL}/users`, {
      headers: authHeaders()
    }).then(res => res.json()),
  
  getUser: async (id: string): Promise<User> => 
    fetch(`${API_BASE_URL}/users/${id}`, {
      headers: authHeaders()
    }).then(res => res.json()),
  
  createUser: async (userData: Partial<User>): Promise<User> => 
    fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(userData)
    }).then(res => res.json()),

  // Projects
  getProjects: async (): Promise<Project[]> => 
    fetch(`${API_BASE_URL}/projects`, {
      headers: authHeaders()
    }).then(res => res.json()),
  
  getProject: async (id: string): Promise<Project> => 
    fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: authHeaders()
    }).then(res => res.json()),
  
  createProject: async (projectData: Partial<Project>): Promise<Project> => 
    fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(projectData)
    }).then(res => res.json()),

  // Assignments
  getAssignments: async (): Promise<Assignment[]> => 
    fetch(`${API_BASE_URL}/assignments`, {
      headers: authHeaders()
    }).then(res => res.json()),
  
  getAssignment: async (id: string): Promise<Assignment> => 
    fetch(`${API_BASE_URL}/assignments/${id}`, {
      headers: authHeaders()
    }).then(res => res.json()),
  
  createAssignment: async (assignmentData: Partial<Assignment>): Promise<Assignment> => 
    fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(assignmentData)
    }).then(res => res.json()),
}; 