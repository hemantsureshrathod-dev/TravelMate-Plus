import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { ChatWidget } from './ChatWidget';

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <ChatWidget />
            <footer className="bg-white border-t py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    © 2026 TravelMate+ Maharashtra. All rights reserved.
                </div>
            </footer>
        </div>
    );
};
