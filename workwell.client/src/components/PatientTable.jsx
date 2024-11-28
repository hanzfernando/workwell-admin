import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import ic_eye from '../assets/ic_eye.svg';

const PatientTable = ({ patients, onViewRoutine }) => {
    const navigate = useNavigate(); // Hook for navigation

    // Handle the "View Logs" button click
    const handleViewLogs = (userId) => {
        navigate(`/userlogs/${userId}`); // Redirect to the UserLogsPage with the userId
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            First Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Last Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Age
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Medical Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <tr key={patient.uid}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.firstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.age}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.medicalCondition}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center flex gap-2 justify-center">
                                    {/* View Routine Button */}
                                    <button
                                        className="bg-accent-aqua p-1 rounded-lg hover:bg-teal-500"
                                        onClick={() => onViewRoutine(patient)} // Call onViewRoutine when clicked
                                    >
                                        <img src={ic_eye} alt="View Routine" className="h-6 w-6" />
                                    </button>

                                    {/* View Logs Button */}
                                    <button
                                        onClick={() => handleViewLogs(patient.uid)} // Pass the user's UID to handleViewLogs
                                        className="bg-accent-aqua text-white py-1 px-2 rounded-lg hover:bg-teal-500"
                                    >
                                        View Logs
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-sm text-gray-700">No patients found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;
