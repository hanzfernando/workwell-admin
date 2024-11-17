import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

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
                routines: state.routines.map(routine =>
                    routine.id === action.payload.id ? action.payload : routine
                ),
            }
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
