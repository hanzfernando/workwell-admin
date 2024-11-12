import { createContext, useReducer, useEffect, useState } from 'react';
import { verifyToken } from '../services/authService.js';
import { getToken } from '../utils/authUtil.js'; // Ensure this works
import PropTypes from 'prop-types';

// Initial state
const initialState = {
    user: null,
    token: null,
    loading: true, // Set loading to true initially
    error: null,
};

// Reducer to handle login, logout, and loading states
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload?.user,
                token: action.payload?.token,
                loading: false,
                error: null,
            };
        case 'LOGOUT':
            return { ...initialState };
        case 'SET_LOADING':
            return { loading: action.payload };
        default:
            return state;
    }
};


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const checkToken = async () => {
            const token = getToken();
            if (token) {
                try {
                    const user = await verifyToken(token);
                    if (user) {
                        dispatch({ type: 'LOGIN', payload: { user, token } });
                    } else {
                        removeToken(); // If verification fails, clear the token
                        dispatch({ type: 'SET_LOADING', payload: false });
                    }
                } catch (error) {
                    console.error('Error verifying token:', error);
                    removeToken();
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkToken(); // Run on app load
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {!state.loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
