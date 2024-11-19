import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigationBar from '../components/SideNavigationBar.jsx';

const MainLayout = () => {
    return (
        <div className="flex h-screen  bg-neutral-light">
            {/* Sidebar */}
            <div className="w-1/5 p-4">
                <SideNavigationBar />
            </div>

            {/* Main content */}
            <div className="w-4/5 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
