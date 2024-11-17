import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPatients } from '../services/patientService'; // Assume this is your API call to fetch patients

const initialState = {
    patients: [],
    loading: true,
    error: null
};

const patientReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PATIENTS':
            return {
                ...state,
                patients: action.payload,
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

const PatientContext = createContext();

const PatientProvider = ({ children }) => {
    const [state, dispatch] = useReducer(patientReducer, initialState);

    // Fetch patients when the provider is mounted
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const result = await getPatients(); // API call to fetch patients
                dispatch({ type: 'SET_PATIENTS', payload: result });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };

        fetchPatients();
    }, []); // Run only once when the provider is mounted

    return (
        <PatientContext.Provider value={{ state, dispatch }}>
            {children}
        </PatientContext.Provider>
    );
};

PatientProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export { PatientContext, PatientProvider };
