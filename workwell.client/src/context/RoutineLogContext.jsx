import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRoutineLogs, getRoutineLogById } from '../services/routineLogService';

const initialState = {
    routineLogs: [],
    selectedRoutineLog: null,
    loading: true,
    error: null
};

const routineLogReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ROUTINE_LOGS':
            return {
                ...state,
                routineLogs: action.payload,
                loading: false,
                error: null
            };
        case 'SET_ROUTINE_LOG':
            return {
                ...state,
                selectedRoutineLog: action.payload,
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

const RoutineLogContext = createContext();

const RoutineLogProvider = ({ children }) => {
    const [state, dispatch] = useReducer(routineLogReducer, initialState);

    // Fetch all routine logs when the provider is mounted
    useEffect(() => {
        const fetchRoutineLogs = async () => {
            try {
                const logs = await getRoutineLogs();
                dispatch({ type: 'SET_ROUTINE_LOGS', payload: logs });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };

        fetchRoutineLogs();
    }, []);

    return (
        <RoutineLogContext.Provider value={{ state, dispatch }}>
            {children}
        </RoutineLogContext.Provider>
    );
};

RoutineLogProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export { RoutineLogContext, RoutineLogProvider };
