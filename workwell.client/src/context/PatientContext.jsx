import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getPatients, getAllOrganizationPatients } from '../services/patientService'; // Assume this is your API call to fetch patients
import { useAuthContext } from '../hooks/useAuthContext.js';
import UserRole from '../utils/Roles'

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
        case 'ADD_PATIENT': 
            return {
                ...state,
                patients: [...state.patients, action.payload],
                error: null
            };
        case 'ADD_ROUTINE_TO_USER':
            const { userId, routineId } = action.payload;
            return {
                ...state,
                patients: state.patients.map((patient) =>
                    patient.uid === userId
                        ? {
                            ...patient,
                            routines: [...new Set([...(patient.routines || []), routineId])],
                        }
                        : patient
                ),
            };
        case 'REMOVE_ROUTINE_FROM_USER': {
            const { userId, routineId } = action.payload;

            return {
                ...state,
                patients: state.patients.map((patient) =>
                    patient.uid === userId
                        ? {
                            ...patient,
                            routines: (patient.routines || []).filter((id) => id !== routineId),
                        }
                        : patient
                ),
            };
        }

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
    const { user } = useAuthContext(); // Get the authenticated user and role

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

        const fetchOrganizationPatients = async () => {
            try {
                const result = await getAllOrganizationPatients(); // API call to fetch patients
                dispatch({ type: 'SET_PATIENTS', payload: result.data });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        }

        // Check if user exists and their role is SuperAdmin
        if (user?.role === UserRole.Admin) {
            fetchPatients();
        } else if (user?.role === UserRole.AdminAssistant) {
            fetchOrganizationPatients();
        }
        else if (user) {
            console.warn('Unauthorized: User is not a Admin.');
            dispatch({ type: 'ERROR', payload: 'Unauthorized access.' });
        }

    }, [user]); // Run only once when the provider is mounted

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
