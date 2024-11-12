import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';

// Import Pages
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import RoutinesPage from './pages/RoutinesPage';
import ExercisesPage from './pages/ExercisesPage';
import LoginPage from './pages/LoginPage';

// Import Layouts
import MainLayout from './layouts/MainLayout';

import { useAuthContext } from "./hooks/useAuthContext.js"

const App = () => {
    const { user } = useAuthContext();
    console.log(user); // Add this line to log user data

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                {/* Public route for Login */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes within MainLayout */}
                <Route path='/' element={user ? <MainLayout /> : <Navigate to='/login' />}>
                    <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to='/login' />} />
                    <Route path="/users" element={user && user.role === 0 ? <UsersPage /> : <Navigate to='/login' />} />
                    <Route path="/routines" element={user && user.role === 0 ? <RoutinesPage /> : <Navigate to='/login' />} />
                    <Route path="/exercises" element={user && user.role === 0 ? <ExercisesPage /> : <Navigate to='/login' />} />
                </Route>
            </>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
