import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigationBar from '../components/SideNavigationBar.jsx';

const MainLayout = () => {
    return (
        <div className="flex h-screen bg-neutral-light">
            {/* Sidebar */}
            <div className="flex-[2] p-4 max-w-xs">
                <SideNavigationBar />
            </div>

            {/* Main content */}
            <div className="flex-[5] p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );

};

export default MainLayout;
