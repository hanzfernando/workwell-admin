import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    getAllOrganizations,
    addOrganization,
    updateOrganization,
    markOrganizationInactive
} from '../services/OrganizationService'; // API calls to interact with the organization API
import { useAuthContext } from '../hooks/useAuthContext.js';
import UserRole from '../utils/Roles'


// Initial state
const initialState = {
    organizations: [],
    loading: true,
    error: null
};

// Reducer function
const organizationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ORGANIZATIONS':
            return {
                ...state,
                organizations: action.payload,
                loading: false,
                error: null
            };
        case 'CREATE_ORGANIZATION':
            return {
                ...state,
                organizations: [...state.organizations, action.payload],
                loading: false,
                error: null
            };
        case 'UPDATE_ORGANIZATION':
            return {
                ...state,
                organizations: state.organizations.map(org =>
                    org.organizationId === action.payload.organizationId ? action.payload : org
                ),
                loading: false,
                error: null
            };
        case 'DELETE_ORGANIZATION':
            return {
                ...state,
                organizations: state.organizations.filter(
                    org => org.organizationId !== action.payload
                ),
                loading: false,
                error: null
            };
        case 'ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        default:
            return state;
    }
};

// Context creation
const OrganizationContext = createContext();

// Provider component
const OrganizationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(organizationReducer, initialState);
    const { user } = useAuthContext(); // Get the authenticated user and role

    // Fetch organizations when the provider is mounted
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const organizations = await getAllOrganizations(); // Fetch all organizations
                dispatch({ type: 'SET_ORGANIZATIONS', payload: organizations });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };
        // Check if user exists and their role is SuperAdmin
        if (user?.role === UserRole.SuperAdmin) {
            fetchOrganizations();
        } else if (user) {
            console.warn('Unauthorized: User is not a SuperAdmin.');
            dispatch({ type: 'ERROR', payload: 'Unauthorized access.' });
        }
    }, [user]); // Run only once when the provider is mounted

    // Return the provider with state and dispatch
    return (
        <OrganizationContext.Provider value={{ state, dispatch }}>
            {children}
        </OrganizationContext.Provider>
    );
};

OrganizationProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export { OrganizationContext, OrganizationProvider };
