import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Retrieve Users safely
            let users: any[] = [];
            try {
                const storedUsers = localStorage.getItem("users");
                const parsed = storedUsers ? JSON.parse(storedUsers) : [];
                if (Array.isArray(parsed)) {
                    users = parsed;
                }
            } catch (error) {
                console.error("Login read error", error);
                users = [];
            }

            // 2. Validate Credentials
            const safeEmail = email.trim().toLowerCase();

            const user = users.find((u: any) =>
                u && u.email &&
                u.email.toString().trim().toLowerCase() === safeEmail &&
                u.password === password // Simple checking for demo
            );

            if (user) {
                // 3. Success -> Update Session
                // Ensure token exists for TS (storage.login will overwrite/add it anyway)
                login({ ...user, token: user.token || 'mock-login-token' });
                navigate('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed due to application error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
                <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button fullWidth size="lg">Login</Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};
