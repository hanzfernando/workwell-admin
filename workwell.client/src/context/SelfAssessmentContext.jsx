import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllSelfAssessments } from '../services/selfAssessmentService';

const initialState = {
    selfAssessments: [],
    loading: true,
    error: null,
};

const selfAssessmentReducer = (state, action) => {
    switch (action.type) {
        case 'SET_SELF_ASSESSMENTS':
            return { ...state, selfAssessments: action.payload, loading: false, error: null };
        case 'ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

const SelfAssessmentContext = createContext();

const SelfAssessmentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(selfAssessmentReducer, initialState);

    useEffect(() => {
        const fetchSelfAssessments = async () => {
            try {
                const selfAssessments = await getAllSelfAssessments();
                dispatch({ type: 'SET_SELF_ASSESSMENTS', payload: selfAssessments });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };
        fetchSelfAssessments();
    }, []);

    return (
        <SelfAssessmentContext.Provider value={{ state, dispatch }}>
            {children}
        </SelfAssessmentContext.Provider>
    );
};

SelfAssessmentProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { SelfAssessmentContext, SelfAssessmentProvider };
