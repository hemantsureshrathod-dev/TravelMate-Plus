import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Robustly get users array logic
      let users: any[] = [];
      try {
        const storedUsers = localStorage.getItem("users");
        // Ensure it's treated as an array always
        const parsed = storedUsers ? JSON.parse(storedUsers) : [];
        if (Array.isArray(parsed)) {
          users = parsed;
        } else {
          // Reset if corrupt structure found
          users = [];
        }
      } catch (err) {
        console.error("Error parsing users from localStorage", err);
        users = [];
      }

      // 2. Normalize inputs
      const safeEmail = email.trim().toLowerCase();
      const safeName = name.trim();

      // 3. Defensive Check for Existing User
      const existingUser = users.find((u: any) =>
        u && u.email && u.email.toString().trim().toLowerCase() === safeEmail
      );

      if (existingUser) {
        setError("User already exists. Please login.");
        return;
      }

      // 4. Create New User
      const newUser = {
        _id: Date.now().toString(), // Helper ID
        name: safeName,
        email: safeEmail,
        password: password, // In a real app never store query passwords, but this is a demo
        token: 'mock-token-' + Date.now()
      };

      // 5. Save Back to LocalStorage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // 6. Log the user in immediately (Update Session)
      login(newUser);
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError("Something went wrong during signup.");
    }
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
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};
