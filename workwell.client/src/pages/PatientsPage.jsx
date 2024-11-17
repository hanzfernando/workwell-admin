import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePatientContext } from '../hooks/usePatientContext';
import { getPatients } from '../services/patientService'
import PatientTable from '../components/PatientTable';

const PatientsPage = () => {
    const { user } = useAuthContext();
    const { state: { patients }, dispatch } = usePatientContext(); // Get patients from context
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    // Fetch all patients on mount (only if context is empty)
    useEffect(() => {
        const fetchPatients = async () => {
            if (patients.length === 0) {
                try {
                    const result = await getPatients(); // Fetch patients from the API
                    dispatch({ type: 'SET_USERS', payload: result }); // Update context state
                } catch (error) {
                    console.error("Error fetching patients:", error);
                }
            }
        };

        fetchPatients();
    }, [patients, dispatch]);

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

    return (
        <div>
            <div className="font-medium text-lg">
                <h1>Hello, {user.displayName}</h1>
            </div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h2 className="text-xl font-semibold">Patients</h2>
                    <div className="flex space-x-2">
                        <button className="flex items-center bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600">
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
                <PatientTable patients={filteredPatients} />
            </div>
        </div>
    );
};

export default PatientsPage;
