import React, { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllAdmins } from '../services/superAdminService';
import { getAllOrganizationAdmins } from '../services/adminService'; 
import { useAuthContext } from '../hooks/useAuthContext.js';
import UserRole from '../utils/Roles';
const initialState = {
    admins: [],
    loading: true,
    error: null,
};

const adminReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ADMINS':
            return { ...state, admins: action.payload, loading: false, error: null };

        case 'ADD_ADMIN':
            return { ...state, admins: [...state.admins, action.payload], error: null };

        case 'UPDATE_ADMIN':
            return {
                ...state,
                admins: state.admins.map((admin) =>
                    admin.uid === action.payload.uid ? { ...admin, ...action.payload } : admin
                ),
                error: null
            };

        case 'ERROR':
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const [state, dispatch] = useReducer(adminReducer, initialState);
    const { user } = useAuthContext(); // Get the authenticated user and role

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const admins = await getAllAdmins();
                dispatch({ type: 'SET_ADMINS', payload: admins.data });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };

        const fetchOrganizationAdmins = async () => {
            try {
                const admins = await getAllOrganizationAdmins();              
                dispatch({ type: 'SET_ADMINS', payload: admins });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        }

        // Check if user exists and their role is SuperAdmin
        if (user?.role === UserRole.SuperAdmin) {
            fetchAdmins();
        } else if (user?.role === UserRole.Admin || user?.role === UserRole.AdminAssistant) {
            fetchOrganizationAdmins();
        } else if (user) {
            console.warn('Unauthorized: User is not a SuperAdmin.');
            dispatch({ type: 'ERROR', payload: 'Unauthorized access.' });
        }
    }, [user]);

    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    );
};

AdminProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AdminContext, AdminProvider };
