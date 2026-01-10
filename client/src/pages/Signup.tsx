import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import api from '../utils/api';

export const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    

const handleSignup = (e: React.FormEvent) => {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const existingUser = users.find(
    (u: any) => u.email === email
  );

  if (existingUser) {
    setError("User already exists");
    return;
  }

  const newUser = {
    name,
    email,
    password,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  navigate("/dashboard");
};




    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSignup} className="space-y-4">
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <Button fullWidth size="lg">Sign Up</Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};
