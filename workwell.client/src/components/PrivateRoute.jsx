import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext'; // Assuming you have an AuthContext

const PrivateRoute = ({ children }) => {
    const { user } = useAuthContext();

    // Check if the user exists and has an 'admin' role
    if (!user || user.user.role !== 0) {
        return <Navigate to="/login" />;
    }

    return children; // Render children if the user is an admin
};

export default PrivateRoute;
