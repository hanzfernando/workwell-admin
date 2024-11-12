import React from 'react';
import { NavLink } from 'react-router-dom';

const SideNavigationBar = () => {
    return (
        <div className="flex flex-col items-start">
            {/* Profile Section */}
            <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gray-400 rounded-full mr-3"></div>
                <span className="text-lg font-medium">Clinic Admin</span>
            </div>

            {/* Greeting */}
            <p className="mb-6 text-lg font-semibold">Hello, Display Name</p>

            {/* Navigation Links */}
            <nav className="space-y-4 w-full">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `block w-full px-4 py-2 text-left rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `block w-full px-4 py-2 text-left rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`
                    }
                >
                    Users
                </NavLink>

                <NavLink
                    to="/routines"
                    className={({ isActive }) =>
                        `block w-full px-4 py-2 text-left rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`
                    }
                >
                    Routines
                </NavLink>

                <NavLink
                    to="/exercises"
                    className={({ isActive }) =>
                        `block w-full px-4 py-2 text-left rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`
                    }
                >
                    Exercises
                </NavLink>
            </nav>
        </div>
    );
};

export default SideNavigationBar;
