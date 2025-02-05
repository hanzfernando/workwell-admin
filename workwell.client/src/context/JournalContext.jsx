import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllJournals } from '../services/journalService';
import { useAuthContext } from '../hooks/useAuthContext.js';
import UserRole from '../utils/Roles'
const initialState = {
    journals: [],
    loading: true,
    error: null,
};

const journalReducer = (state, action) => {
    switch (action.type) {
        case 'SET_JOURNALS':
            return { ...state, journals: action.payload, loading: false, error: null };
        case 'ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

const JournalContext = createContext();

const JournalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(journalReducer, initialState);
    const { user } = useAuthContext(); // Get the authenticated user and role

    useEffect(() => {
        const fetchJournals = async () => {
            try {
                const journals = await getAllJournals();
                dispatch({ type: 'SET_JOURNALS', payload: journals });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };
        if (user?.role === UserRole.Admin || user?.role === UserRole.AdminAssistant) {
            fetchJournals();
        } else if (user) {
            console.warn('Unauthorized: User is not a Admin.');
            dispatch({ type: 'ERROR', payload: 'Unauthorized access.' });
        }
    }, [user]);

    return (
        <JournalContext.Provider value={{ state, dispatch }}>
            {children}
        </JournalContext.Provider>
    );
};

JournalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { JournalContext, JournalProvider };
