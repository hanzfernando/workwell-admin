import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';

// Import Pages
import UsersPage from './pages/PatientsPage';
import RoutinesPage from './pages/RoutinesPage';
import AdminExercisesPage from './pages/AdminExercisesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RoutineLogsPage from './pages/RoutineLogsPage';
import NotFoundPage from './pages/NotFoundPage';
import UserLogsPage from './pages/UserLogsPage';
import SuperAdminAdminsPage from './pages/SuperAdminAdminsPage';
import SuperAdminOrganizationsPage from './pages/SuperAdminOrganizationsPage';
// Import Layouts
import MainLayout from './layouts/MainLayout';

// Import Auth Context
import { useAuthContext } from './hooks/useAuthContext';

import UserRole from './utils/Roles'
// Protected Route Wrapper for Admins (role = 0)
const AdminRoute = ({ children }) => {
    const { user } = useAuthContext();

    // If no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is not an Admin, redirect to login
    if (user.role !== UserRole.Admin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Protected Route Wrapper for SuperAdmins (role = 2)
const SuperAdminRoute = ({ children }) => {
    const { user } = useAuthContext();

    // If no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is not a SuperAdmin, redirect to login
    if (user.role !== UserRole.SuperAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route Wrapper
const PublicRoute = ({ children }) => {
    const { user } = useAuthContext();
    // If user is already logged in, redirect based on role
    if (user) {
        if (user.role === UserRole.Admin) {
            // Admin
            return <Navigate to="/users" replace />;
        } else if (user.role === UserRole.SuperAdmin) {
            // SuperAdmin
            return <Navigate to="/admins" replace />;
        } else {
            // For User (role = 1) or any other role you haven't explicitly handled
            // Adjust this logic as needed (maybe you have a separate user dashboard?)
            return <Navigate to="/login" replace />;
        }
    }

    // Otherwise, let them proceed to the public route (login/signup)
    return children;
};

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <SignupPage />
                        </PublicRoute>
                    }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Protected Routes for Admins (role = 0) */}
                <Route
                    element={
                        <AdminRoute>
                            <MainLayout />
                        </AdminRoute>
                    }
                >
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/routines" element={<RoutinesPage />} />
                    <Route path="/exercises" element={<AdminExercisesPage />} />
                    <Route path="/routinelogs" element={<RoutineLogsPage />} />
                    <Route path="/userlogs/:uid" element={<UserLogsPage />} />
                </Route>

                {/* Protected Routes for SuperAdmins (role = 2) */}
                <Route
                    element={
                        <SuperAdminRoute>
                            <MainLayout />
                        </SuperAdminRoute>
                    }
                >
                    <Route path="/admins" element={<SuperAdminAdminsPage />} />
                    <Route path="/organizations" element={<SuperAdminOrganizationsPage />} />
                </Route>

                {/* Catch-all Route for 404 - Not Found */}
                <Route path="*" element={<NotFoundPage />} />
            </>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
