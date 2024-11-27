import React, { useState, useEffect, useContext } from 'react';
import { getRoutineLogs } from '../services/routineLogService'; // Service to fetch RoutineLogs
import RoutineLogTable from '../components/RoutineLogTable';
import { PatientContext } from '../context/PatientContext'; // Import PatientContext
import { usePatientContext } from '../hooks/usePatientContext';

const RoutineLogsPage = () => {
    const [routineLogs, setRoutineLogs] = useState([]);
    const [augmentedRoutineLogs, setAugmentedRoutineLogs] = useState([]); // Logs with patient names
    const [filteredRoutineLogs, setFilteredRoutineLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const { state: { patients } } = usePatientContext(); // Access patients from PatientContext

    // Fetch all RoutineLogs when the component is mounted
    useEffect(() => {
        const fetchRoutineLogs = async () => {
            try {
                const result = await getRoutineLogs(); // Fetch RoutineLogs from the backend
                setRoutineLogs(result); // Save fetched RoutineLogs in state
            } catch (error) {
                console.error('Error fetching routine logs:', error);
            }
        };

        fetchRoutineLogs();
    }, []);

    // Map RoutineLogs with patient names based on UID
    useEffect(() => {
        const augmentLogs = () => {
            const mappedLogs = routineLogs.map((log) => {
                const patient = patients.find((p) => p.uid === log.uid); // Find patient by UID
                const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown User';
                return {
                    ...log,
                    patientName // Add patient name to the log
                };
            });
            setAugmentedRoutineLogs(mappedLogs); // Update augmented logs
            setFilteredRoutineLogs(mappedLogs); // Update filtered logs
        };

        augmentLogs();
    }, [routineLogs, patients]); // Run this effect when logs or patients change

    // Filter RoutineLogs based on the search query
    useEffect(() => {
        const filtered = augmentedRoutineLogs.filter((log) =>
            log.routineLogName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.createdAtDateTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //log.routineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.patientName.toLowerCase().includes(searchQuery.toLowerCase()) // Include patient name in search
        );
        setFilteredRoutineLogs(filtered);
    }, [searchQuery, augmentedRoutineLogs]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update search query
    };

    return (
        <div>
            <div className="font-medium text-lg">
                <h1>Routine Logs</h1>
            </div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h2 className="text-xl font-semibold">All Routine Logs</h2>
                    <input
                        type="text"
                        placeholder="Search routine logs..."
                        value={searchQuery}
                        onChange={handleSearchChange} // Update search query state
                        className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                    />
                </div>
                <RoutineLogTable routineLogs={filteredRoutineLogs} /> {/* Pass filtered RoutineLogs to the table */}
            </div>
        </div>
    );
};

export default RoutineLogsPage;
