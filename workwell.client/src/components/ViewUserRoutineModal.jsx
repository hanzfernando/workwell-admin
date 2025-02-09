import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRoutineContext } from '../hooks/useRoutineContext';
import { useExerciseContext } from '../hooks/useExerciseContext'; // Import the exercise context
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import ic_eye from '../assets/ic_eye.svg';
import ic_plus from '../assets/ic_plus.svg';
import AddRoutineModal from './AddRoutineModal';
import UserRole from '../utils/Roles';
import { useAuthContext } from '../hooks/useAuthContext';

const ViewUserRoutineModal = ({ isOpen, onClose, userId, patientRoutineIds, onRoutineAdded }) => {
    const { state: { routines } } = useRoutineContext();
    const { state: { exercises } } = useExerciseContext(); // Access exercises from context
    const [patientRoutines, setPatientRoutines] = useState([]); // Routines for the patient
    const [expandedRoutineId, setExpandedRoutineId] = useState(null); // Track expanded routine
    const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false); // Control AddRoutineModal visibility
    const { user } = useAuthContext();
    const navigate = useNavigate(); // Hook for navigation

    // Filter routines for the selected patient based on routineId
    useEffect(() => {
        if (isOpen) {
            const filteredRoutines = routines.filter(routine =>
                patientRoutineIds.includes(routine.routineId)
            );
            setPatientRoutines(filteredRoutines);
        }
    }, [isOpen, patientRoutineIds, routines]);

    const handleClose = () => {
        setExpandedRoutineId(null); // Reset expanded routine
        setPatientRoutines([]); // Reset routines when closing modal
        onClose();
    };

    const handleToggleExercises = (routineId) => {
        setExpandedRoutineId(prevState => (prevState === routineId ? null : routineId)); // Toggle expansion
    };

    // Helper function to get exercise details
    const getExerciseDetails = (exerciseId) => {
        const exercise = exercises.find(ex => ex.exerciseId === exerciseId);
        return exercise ? exercise.name : 'Unknown Exercise'; // Default if exercise not found
    };

    const handleOpenAddRoutine = () => {
        setIsAddRoutineOpen(true);
    };

    if (!isOpen) {
        return null; // Don't render if modal is closed
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 overflow-auto relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <span className="text-2xl">&times;</span>
                </button>

                <div className="flex gap-4 items-center mb-4">
                    <h2 className="text-xl font-semibold">Patient's Routines</h2>

                    {user.role === UserRole.Admin && 
                        
                        <button
                            onClick={handleOpenAddRoutine}
                            className="bg-accent-aqua p-2 rounded-lg hover:bg-teal-500 flex items-center justify-center w-8 h-8"
                        >
                        <img src={ic_plus} alt="Add Routine" className="w-4 h-4" />
                        </button>
                    }
                </div>


                

                {patientRoutines.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Routine Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Target Area
                                </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Start Date
                                </th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {patientRoutines.map(routine => (
                                <React.Fragment key={routine.routineId}>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {routine.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {routine.targetArea}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {routine.startDateFormatted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {routine.endDateFormatted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex gap-2">
                                            <button
                                                onClick={() => handleToggleExercises(routine.routineId)}
                                                className="bg-accent-aqua p-1 rounded-lg hover:bg-teal-500"
                                            >
                                                <img src={ic_eye} alt="View Exercises" className="h-6 w-6" />
                                            </button>
                                            
                                        </td>
                                    </tr>
                                    {expandedRoutineId === routine.routineId && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-2 border-b">
                                                <div className="overflow-hidden transition-all duration-500 ease-in-out">
                                                    <table className="min-w-full divide-y divide-gray-200 bg-gray-50">
                                                        <thead className="bg-gray-200">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    Exercise Name
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    Reps
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                                    Duration (millisecond)
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {routine.exercises.map((exercise, index) => (
                                                                <tr key={exercise.exerciseId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                        {getExerciseDetails(exercise.exerciseId)}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                        {exercise.reps}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                        {exercise.duration}
                                                                    </td>
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
                ) : (
                    <p className="text-sm text-gray-500">No routines found for this patient.</p>
                )}

                {isAddRoutineOpen && user.role === UserRole.Admin && (
                    <AddRoutineModal
                        isOpen={isAddRoutineOpen}
                        onClose={() => setIsAddRoutineOpen(false)}
                        onAddRoutine={() => { }}
                        patientId={userId}
                        isUnique={true}
                        onRoutineAdded={onRoutineAdded}
                    />
                )}
            </div>
        </div>
    );
};

ViewUserRoutineModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    patientRoutineIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ViewUserRoutineModal;
