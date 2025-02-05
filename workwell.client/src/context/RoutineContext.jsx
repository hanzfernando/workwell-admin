import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllRoutines } from '../services/routineService';
import { useAuthContext } from '../hooks/useAuthContext'; // Import the AuthContext hook
import UserRole from '../utils/Roles'

const initialState = {
    routines: [],
    loading: false,
    error: null
}

const routineReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ROUTINES':
            return {
                ...state,
                routines: action.payload,
                loading: false,
                error: null
            }
        case 'CREATE_ROUTINE':
            return {
                ...state,
                routines: [...state.routines, action.payload],
                loading: false,
                error: null
            }
        case 'UPDATE_ROUTINE':
            return {
                ...state,
                routines: state.routines.map((routine) =>
                    routine.routineId === action.payload.routineId
                        ? { ...action.payload, users: action.payload.users || [] } // Ensure `users` is always defined
                        : routine
                ),
                loading: false,
                error: null,
            };


        case 'DELETE_ROUTINE':
            return {
                ...state,
                routines: state.routines.filter(routine => routine.id !== action.payload)
            }
        default:
            return state;
    }
}

const RoutineContext = createContext();

const RoutineProvider = ({ children }) => {
    const [state, dispatch] = useReducer(routineReducer, initialState);
    const { user } = useAuthContext(); // Get the authenticated user and role

    // Fetch routines on initialization
    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const routines = await getAllRoutines(); // Fetch all routines
                dispatch({ type: 'SET_ROUTINES', payload: routines });
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
            }
        };

        // Check if user exists and their role is SuperAdmin
        if (user?.role === UserRole.Admin || user?.role === UserRole.AdminAssistant) {
            fetchRoutines();
        } else if (user) {
            console.warn('Unauthorized: User is not a Admin.');
            dispatch({ type: 'ERROR', payload: 'Unauthorized access.' });
        }
    }, [user]);

    return (
        <RoutineContext.Provider value={{ state, dispatch }}>
            {children}
        </RoutineContext.Provider>
    )
}

RoutineProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export { RoutineContext, RoutineProvider };
