import React, { useContext, useState, useEffect } from 'react';
import { useRoutineContext } from '../hooks/useRoutineContext';
import PropTypes from 'prop-types';
import ic_eye from '../assets/ic_eye.svg';

const ViewUserRoutineModal = ({ isOpen, onClose, userId }) => {
    const { state: { routines } } = useRoutineContext();
    const [selectedRoutine, setSelectedRoutine] = useState([]); // Initialize as an array
    const [expandedRoutineId, setExpandedRoutineId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            // Filter routines where the assignedTo field matches the userId
            const userRoutines = routines.filter(routine => routine.assignedTo === userId);
 
            setSelectedRoutine(userRoutines); // Store the array of routines
        }
    }, [isOpen, userId, routines]);

    const handleClose = () => {
        onClose();
        setSelectedRoutine([]); // Reset to an empty array when closing the modal
        setExpandedRoutineId(null); // Reset the expanded routine state
    };

    const handleToggleExercises = (routineId) => {
        setExpandedRoutineId(prevState => prevState === routineId ? null : routineId); // Toggle expansion (close if already open)
    };

    if (!isOpen || selectedRoutine.length === 0) {
        return null; // Don't render anything if the modal is not open or no routines are selected
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 overflow-auto relative">
                {/* Close Button */}
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <span className="text-2xl">&times;</span>
                </button>

                <h2 className="text-xl font-semibold mb-4">Routine Details</h2>

                <table className="min-w-full divide-y divide-gray-200 mb-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Target Area</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assigned To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {selectedRoutine.map(routine => (
                            <React.Fragment key={routine.routineId}>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{routine.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{routine.targetArea}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{routine.assignedName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <button
                                            onClick={() => handleToggleExercises(routine.routineId)}
                                            className="bg-accent-aqua p-1 rounded-lg"
                                        >
                                            <img src={ic_eye} alt="View" className="h-6 w-6" />
                                        </button>
                                    </td>
                                </tr>
                                {expandedRoutineId === routine.routineId && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-2 border-b">
                                            <div
                                                className="overflow-hidden transition-all duration-500 ease-in-out"
                                                style={{ maxHeight: expandedRoutineId === routine.routineId ? '500px' : '0' }}
                                            >
                                                <table className="min-w-full divide-y divide-gray-200 bg-gray-50">
                                                    <thead className="bg-gray-200">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Exercise Name</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reps</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sets</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rest (sec)</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {routine.exercises.map((exercise, index) => (
                                                            <tr key={exercise.exerciseId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.exerciseName}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.reps}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.sets}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.rest}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.exerciseDescription}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

ViewUserRoutineModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
};

export default ViewUserRoutineModal;
