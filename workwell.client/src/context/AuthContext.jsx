import { createContext, useReducer, useEffect } from 'react';
import { verifyToken } from '../services/authService.js';
import { getToken, removeToken, setToken } from '../utils/authUtil.js';
import PropTypes from 'prop-types';

// Initial state
const initialState = {
    user: null,
    token: null,
    loading: true,
    error: null,
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case 'LOGOUT':
            return { ...initialState, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

// Context creation
const AuthContext = createContext();

// Provider
const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = getToken();
            if (token) {
                try {
                    const user = await verifyToken(token);
                    if (user.role === 1) {
                        console.warn('Unauthorized user. Logging out...');
                        await auth.signOut();
                        removeToken();
                        dispatch({ type: 'LOGOUT' });
                    } else {
                        dispatch({ type: 'LOGIN', payload: { user, token } });
                    }
                } catch (error) {
                    console.error('Error during token verification:', error);
                    removeToken();
                    dispatch({ type: 'SET_ERROR', payload: 'Session expired. Please log in again.' });
                }
            }
            dispatch({ type: 'SET_LOADING', payload: false });
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {state.loading ? null : children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
