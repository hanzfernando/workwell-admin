import React, { useState } from 'react';
import { usePatientContext } from '../hooks/usePatientContext';

const AssignRoutineModal = ({ isOpen, onClose, routine, onAssign }) => {
    const { state: { patients } } = usePatientContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    if (!isOpen) return null;

    console.log(patients);

    const filteredPatients = patients.filter((patient) =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = () => {
        if (selectedPatient) {
            onAssign(routine, selectedPatient);
            onClose();
        } else {
            alert('Please select a patient.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Assign Routine</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-lg">{routine.name}</h4>
                        <p className="text-sm text-gray-500">Target Area: {routine.targetArea}</p>
                    </div>

                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                    />

                    <div className="overflow-y-auto max-h-60 border rounded">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        First Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Last Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Select
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.uid}>
                                        <td className="px-6 py-4 text-sm text-gray-700">{patient.firstName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{patient.lastName}</td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="radio"
                                                name="selectedPatient"
                                                onChange={() => setSelectedPatient(patient)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-sm text-gray-500">
                                            No patients found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignRoutineModal;
