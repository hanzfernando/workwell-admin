import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getExercises } from '../services/exerciseService'; // Assume this is your API call to fetch exercises
import { useAuthContext } from '../hooks/useAuthContext'; // Import the AuthContext hook
import UserRole from '../utils/Roles'

const initialState = {
    exercises: [],
    loading: true,
    error: null
};

const exerciseReducer = (state, action) => {
    switch (action.type) {
        case 'SET_EXERCISES':
            return {
                ...state,
                exercises: action.payload,
                loading: false,
                error: null
            };
        case 'CREATE_EXERCISE':
            return {
                ...state,
                exercises: [...state.exercises, action.payload],
                loading: false,
                error: null
            };
        case 'UPDATE_EXERCISE':
            return {
                ...state,
                exercises: state.exercises.map(exercise =>
                    exercise.id === action.payload.id ? action.payload : exercise
                ),
                loading: false,
                error: null
            };
        case 'DELETE_EXERCISE':
            return {
                ...state,
                exercises: state.exercises.filter(exercise => exercise.id !== action.payload),
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

const ExerciseContext = createContext();

const ExerciseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(exerciseReducer, initialState);
    const { user } = useAuthContext(); // Get the authenticated user and role

    // Fetch exercises if the user role is Admin
    useEffect(() => {
        const fetchExercises = async () => {
            
            try {
                const result = await getExercises(); // API call to fetch exercises
                dispatch({ type: 'SET_EXERCISES', payload: result });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
            
        };

        // Check if user exists and their role is SuperAdmin
        if (user?.role === UserRole.Admin || user?.role === UserRole.AdminAssistant) {
            fetchExercises();
        } else if (user) {
            console.warn('Unauthorized: User is not a Admin.');
            dispatch({ type: 'ERROR', payload: 'Unauthorized access.' });
        }
    }, [user]); // Re-run if the user changes

    return (
        <ExerciseContext.Provider value={{ state, dispatch }}>
            {children}
        </ExerciseContext.Provider>
    );
};

ExerciseProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export { ExerciseContext, ExerciseProvider };
