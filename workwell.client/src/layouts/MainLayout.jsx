import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigationBar from '../components/SideNavigationBar.jsx';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <div className="w-1/5 bg-gray-100 p-4">
                <SideNavigationBar />
            </div>

            {/* Main content */}
            <div className="w-4/5 p-6 bg-gray-300">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
