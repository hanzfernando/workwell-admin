import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePatientContext } from '../hooks/usePatientContext';

const RoutineDetailsModal = ({ isOpen, onClose, routine }) => {
    const { state: { patients } } = usePatientContext();
    const [assignedUsers, setAssignedUsers] = useState([]);

    useEffect(() => {
        if (routine && routine.users) {
            // Map user IDs to patient information from the context
            const userDetails = routine.users.map(userId => {
                const patient = patients.find(p => p.uid === userId);
                return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown User';
            });
            setAssignedUsers(userDetails);
        }
    }, [routine, patients]);

    if (!isOpen || !routine) return null;

    // Ensure routine.exercises is always an array, even if undefined
    const exercises = routine.exercises || [];
    //console.log(exercises)

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Routine Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Routine Information */}
                    <div>
                        <h4 className="font-medium text-lg">{routine.name}</h4>
                        <p className="text-sm text-gray-500">
                            <strong>Target Area:</strong> {routine.targetArea}
                        </p>
                        <p className="text-sm text-gray-500">
                            <strong>Assigned To:</strong>
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-500">
                            {assignedUsers.length > 0 ? (
                                assignedUsers.map((user, index) => (
                                    <li key={index}>{user}</li>
                                ))
                            ) : (
                                <li>Unassigned</li>
                            )}
                        </ul>
                    </div>

                    {/* Exercises Table */}
                    <h5 className="font-medium text-lg">Exercises</h5>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Exercise Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Reps
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Duration (sec)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {exercises.length > 0 ? (
                                    exercises.map((exercise) => (
                                        <tr key={exercise.exerciseId}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {exercise.exerciseName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {exercise.reps || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {exercise.duration || 'N/A'} sec
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-sm text-gray-500">
                                            No exercises available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

RoutineDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    routine: PropTypes.object,
};

export default RoutineDetailsModal;
