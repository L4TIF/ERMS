import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

export default function Login() {
    const { login, loading, error, checkAuth, currentUser } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in
        checkAuth();
    }, [checkAuth]);

    // Navigate if user is already authenticated
    useEffect(() => {
        if (currentUser) {
            navigate(currentUser.role === 'manager' ? '/manager' : '/engineer');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await login(email.trim(), password.trim());
        if (result.success) {
            const { currentUser } = useStore.getState();
            if (currentUser) {
                navigate(currentUser.role === 'manager' ? '/manager' : '/engineer');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">
                        ERMS Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="john@company.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="password123"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-600">
                    <p>Demo Accounts:</p>
                    <p>Manager: lisa@company.com</p>
                    <p>Engineers: john@company.com, sarah@company.com, mike@company.com</p>
                    <p>Password: password123</p>
                </div>
            </div>
        </div>
    );
} 