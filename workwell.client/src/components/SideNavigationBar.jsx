import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

// Navigation items keyed by string roles
const navItems = {
    SuperAdmin: [
        { name: 'Admins', path: '/admins' },
        { name: 'Organizations', path: '/organizations' },
    ],
    Admin: [
        { name: 'Users', path: '/users' },
        { name: 'Routines', path: '/routines' },
        { name: 'Exercises', path: '/exercises' },
    ],
    AdminAssistant: [
        { name: 'Users', path: '/users' },
    ]

};

const SideNavigationBar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Retrieve nav items based on user role or default to an empty array
    const items = navItems[user?.role] || [];

    return (
        <nav className="flex flex-col h-full p-2">
            {/* Profile Section */}
            <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-300">
                {/* Placeholder avatar */}
                {/*<div className="w-12 h-12 rounded-full mr-3 bg-accent-aqua"></div>*/}
                {/* Display user's name */}
                <span className="text-lg font-medium">
                    {user?.displayName}
                </span>
            </div>

            {/* Navigation Items */}
            <ul className="mb-auto">
                {items.map(({ name, path }) => (
                    <li key={path} className="mb-4">
                        <NavLink
                            to={path}
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive
                                    ? 'bg-accent-aqua text-white'
                                    : 'text-gray-700 hover:bg-gray-200'
                                }`
                            }
                        >
                            {name}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Change Password Link */}
            {/*<NavLink*/}
            {/*    to="/change-password"*/}
            {/*    className={({ isActive }) =>*/}
            {/*        `block p-2 text-blue-600 hover:bg-blue-100 rounded mb-2 text-center ${isActive ? 'font-bold' : ''}`*/}
            {/*    }*/}
            {/*>*/}
            {/*    Change Password*/}
            {/*</NavLink>*/}

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="block p-2 text-red-600 hover:bg-red-100 rounded border border-red-400"
            >
                Logout
            </button>
        </nav>
    );
};

export default SideNavigationBar;
