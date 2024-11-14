import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';

// Import Pages
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/PatientsPage';
import RoutinesPage from './pages/RoutinesPage';
import ExercisesPage from './pages/ExercisesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

// Import Layouts
import MainLayout from './layouts/MainLayout';

// Import Auth Context
import { useAuthContext } from './hooks/useAuthContext';

// Protected Route Wrapper for Admins
const AdminRoute = ({ children }) => {
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 0) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route Wrapper
const PublicRoute = ({ children }) => {
    const { user } = useAuthContext();

    if (user) {
        // Redirect admins to dashboard and others to login (adjust as needed)
        return <Navigate to={user.role === 0 ? '/dashboard' : '/login'} replace />;
    }

    return children;
};

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                {/* Public Routes */}
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Protected Routes for Admins */}
                <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/routines" element={<RoutinesPage />} />
                    <Route path="/exercises" element={<ExercisesPage />} />
                </Route>

                {/* Catch-all Route for 404 - Not Found */}
                <Route path="*" element={<NotFoundPage />} />
            </>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
