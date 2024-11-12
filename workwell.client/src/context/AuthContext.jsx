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
                user: action.payload?.user || null,  // Safely access user property
                token: action.payload?.token || null,
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
        const idToken = getToken(); // Get the token from localStorage or another source
        if (idToken) {
            // Verify the token and fetch the user details
            verifyToken(idToken) 
                .then(user => {
                    if (user) {
                        // Dispatch LOGIN action with the user details
                        console.log(user)
                        dispatch({
                            type: 'LOGIN',
                            payload: { user, token: idToken },
                        });
                    } else {
                        // Handle case where user is not found or token is invalid
                        dispatch({
                            type: 'SET_LOADING',
                            payload: false,
                        });
                    }
                })
                .catch(error => {
                    console.error('Failed to verify token:', error);
                    dispatch({
                        type: 'SET_LOADING',
                        payload: false,
                    });
                });
        } else {
            dispatch({
                type: 'SET_LOADING',
                payload: false,
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
