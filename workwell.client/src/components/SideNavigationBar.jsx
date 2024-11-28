import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'; // Import the useLogout hook
import { useAuthContext } from '../hooks/useAuthContext'; // To access user info

const SideNavigationBar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext(); // Get user info

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="flex flex-col items-start">
            {/* Profile Section */}
            <div className="flex items-center w-full pb-4 mb-4 border-b border-gray-300">
                <div className="w-12 h-12 rounded-full mr-3 bg-accent-aqua"></div>
                <span className="text-lg font-medium">{user?.role === 0 ? 'Clinic Admin' : 'User'}</span>
            </div>           

            {/* Navigation Links */}
            <nav className="space-y-4 w-full">
                {/*<NavLink*/}
                {/*    to="/dashboard"*/}
                {/*    className={({ isActive }) =>*/}
                {/*        `block w-full px-4 py-2 text-left rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`*/}
                {/*    }*/}
                {/*>*/}
                {/*    Dashboard*/}
                {/*</NavLink>*/}

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

                {/*<NavLink*/}
                {/*    to="/routinelogs"*/}
                {/*    className={({ isActive }) =>*/}
                {/*        `block w-full px-4 py-2 text-left rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`*/}
                {/*    }*/}
                {/*>*/}
                {/*    Routine Logs*/}
                {/*</NavLink>*/}

                <NavLink
                    to="/exercises"
                    className={({ isActive }) =>
                        `block w-full px-4 py-2 text-left rounded-md ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`
                    }
                >
                    Exercises
                </NavLink>

                
            </nav>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
            >
                Logout
            </button>
        </div>
    );
};

export default SideNavigationBar;
