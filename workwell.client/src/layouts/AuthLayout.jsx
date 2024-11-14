import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-primary-blue">       
            {/* Main content */}
            <Outlet />

        </div>
    );
};

export default MainLayout;
