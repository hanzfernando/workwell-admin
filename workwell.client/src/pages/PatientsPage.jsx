import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePatientContext } from '../hooks/usePatientContext';
import { getPatients } from '../services/patientService';
import PatientTable from '../components/PatientTable';
import ViewUserRoutineModal from '../components/ViewUserRoutineModal'; // Import the modal
import AddPatientModal from '../components/AddPatientModal';
import { signUp } from "../services/authService";


const PatientsPage = () => {
    const { user } = useAuthContext();
    const { state: { patients }, dispatch } = usePatientContext(); // Get patients from context
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null); // Track the selected patient
    const [isViewUserRoutineModalOpen, setIsViewUserRoutineModalOpen] = useState(false); // Control the modal state
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

    // Fetch all patients on mount (only if context is empty)
    useEffect(() => {
        const fetchPatients = async () => {           
            try {
                const result = await getPatients(); // Fetch patients from the API
                dispatch({ type: 'SET_USERS', payload: result }); // Update context state
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
            
        };

        fetchPatients();
    }, []);

    // Filter patients based on search query
    useEffect(() => {
        const filtered = patients.filter((patient) => {
            return (
                patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredPatients(filtered);
    }, [searchQuery, patients]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update search query
    };

    const handleViewRoutine = (patient) => {
        setSelectedPatient(patient);
        setIsViewUserRoutineModalOpen(true); // Open the modal when a patient is selected
    };

    const handleCloseModal = () => {
        setIsViewUserRoutineModalOpen(false); // Close the modal
        setSelectedPatient(null); // Reset the selected patient
    };

    const handleOpenAddPatientModal = () => {
        setIsAddPatientModalOpen(true);
    };

    const handleCloseAddPatientModal = () => {
        setIsAddPatientModalOpen(false);
    };

    const handlePatientAdded = async (newPatient) => {
        console.log('Adding patient:', newPatient);

        const addedPatient = await signUp(newPatient.firstName, newPatient.lastName, newPatient.email, newPatient.password, newPatient.age, newPatient.medicalCondition);
        //const addedPatient = {
        //    firstName: newPatient.firstName,
        //    lastName: newPatient.lastName,
        //    email: newPatient.email,
        //    uid: 'sample'
        //}
        console.log("-----------");
        console.log(addedPatient);
        if (addedPatient) {
            //console.log('Patient added:', addedPatient);
            //console.log('Before Dispatch', filteredPatients)

            dispatch({ type: 'ADD_PATIENT', payload: addedPatient });
            setFilteredPatients((prevFilteredPatients) => [...prevFilteredPatients, addedPatient]);
            handleCloseAddPatientModal();
        } else {
            console.error('Error adding patient.')
        }
    }  
    //console.log("0 Patients", patients[0]);
    //console.log("All Patients", patients);
    return (
        <div>
            <div className="font-medium text-lg">
                <h1>Hello, {user.displayName}</h1>
            </div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h2 className="text-xl font-semibold">Patients</h2>
                    <div className="flex space-x-2">
                        <button
                            className="flex items-center bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                            onClick={handleOpenAddPatientModal}
                        >
                            <span className="text-lg mr-2">+</span> Add Patient
                        </button>
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>
                <PatientTable
                    patients={filteredPatients}
                    onViewRoutine={handleViewRoutine} // Pass function to handle view routine
                />
            </div>

            {/* View User Routine Modal */}
            {isViewUserRoutineModalOpen && selectedPatient && (
                <ViewUserRoutineModal
                    isOpen={isViewUserRoutineModalOpen}
                    onClose={handleCloseModal}
                    userId={selectedPatient.uid}
                    patientRoutineIds={selectedPatient.routines} // Pass the patient's routine IDs
                />
            )}

            {/* Add Patient Modal */}
            <AddPatientModal
                isOpen={isAddPatientModalOpen}
                onClose={handleCloseAddPatientModal}
                onAddPatient={handlePatientAdded }
            />
        </div>
    );
};

export default PatientsPage;
