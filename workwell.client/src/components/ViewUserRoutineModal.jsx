import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRoutineContext } from '../hooks/useRoutineContext';
import { useExerciseContext } from '../hooks/useExerciseContext';
import { useNavigate } from 'react-router-dom';
import ic_eye from '../assets/ic_eye.svg';
import ic_plus from '../assets/ic_plus.svg';
import AddRoutineModal from './AddRoutineModal';
import DeleteRoutineConfirmationModal from './DeleteRoutineConfirmationModal'; // Import the modal
import UserRole from '../utils/Roles';
import { useAuthContext } from '../hooks/useAuthContext';
import { deleteRoutine, removeUserFromRoutine } from '../services/routineService';
import { usePatientContext } from '../hooks/usePatientContext';
import ic_trash from '../assets/ic_trash.svg'
const ViewUserRoutineModal = ({ isOpen, onClose, userId, patientRoutineIds, onRoutineAdded, onRoutineUpdated }) => {
    const { state: { routines }, dispatch: routineDispatch } = useRoutineContext();
    const { state: { exercises } } = useExerciseContext();
    const { state: { patients }, dispatch: patientDispatch } = usePatientContext();

    const [patientRoutines, setPatientRoutines] = useState([]);
    const [expandedRoutineId, setExpandedRoutineId] = useState(null);
    const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);
    const [routineToDelete, setRoutineToDelete] = useState(null); // Track routine for deletion
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            const filteredRoutines = routines.filter(routine =>
                patientRoutineIds.includes(routine.routineId)
            );
            setPatientRoutines(filteredRoutines);
        }
    }, [isOpen, patientRoutineIds, routines]);

    const handleClose = () => {
        setExpandedRoutineId(null);
        setPatientRoutines([]);
        onClose();
    };

    const handleToggleExercises = (routineId) => {
        setExpandedRoutineId(prevState => (prevState === routineId ? null : routineId));
    };

    const getExerciseDetails = (exerciseId) => {
        const exercise = exercises.find(ex => ex.exerciseId === exerciseId);
        return exercise ? exercise.name : 'Unknown Exercise';
    };

    const handleOpenAddRoutine = () => {
        setIsAddRoutineOpen(true);
    };

    const confirmDeleteRoutine = (routine) => {
        setRoutineToDelete(routine); // Open confirmation modal       
    };

    const handleDeleteRoutine = async () => {
        if (!routineToDelete) {
            console.error("No routine selected for deletion.");
            return;
        }

        try {
            if (routineToDelete.isUnique) {
                // Unique: Delete routine completely
                await deleteRoutine(routineToDelete.routineId);
                routineDispatch({ type: 'DELETE_ROUTINE', payload: routineToDelete.routineId });

                patientDispatch({
                    type: 'REMOVE_ROUTINE_FROM_USER',
                    payload: { userId, routineId: routineToDelete.routineId },
                });

                console.log(`Deleted unique routine: ${routineToDelete.name}`);
            } else {
                // Non-unique: Remove user from routine
                await removeUserFromRoutine(routineToDelete.routineId, userId);

                // Update context for non-unique routine
                routineDispatch({
                    type: 'UPDATE_ROUTINE',
                    payload: {
                        ...routineToDelete,
                        users: routineToDelete.users.filter((uid) => uid !== userId),
                    },
                });

                patientDispatch({
                    type: 'REMOVE_ROUTINE_FROM_USER',
                    payload: { userId, routineId: routineToDelete.routineId },
                });

                console.log(`Removed user ${userId} from routine: ${routineToDelete.name}`);
            }

            // Update local modal state
            setPatientRoutines((prev) =>
                prev.filter((r) => !(r.routineId === routineToDelete.routineId && routineToDelete.isUnique))
            );

            // Notify parent (AdminPatientsPage)
            onRoutineUpdated(routineToDelete.routineId, 'remove');

        } catch (error) {
            console.error(`Failed to delete routine: ${error.message}`);
        } finally {
            setRoutineToDelete(null);
        }
    };




    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 overflow-auto relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <span className="text-2xl">&times;</span>
                </button>

                <div className="flex gap-4 items-center mb-4">
                    <h2 className="text-xl font-semibold">Patient's Routines</h2>

                    {user.role === UserRole.Admin && (
                        <button
                            onClick={handleOpenAddRoutine}
                            className="bg-accent-aqua p-2 rounded-lg hover:bg-teal-500 flex items-center justify-center w-8 h-8"
                        >
                            <img src={ic_plus} alt="Add Routine" className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {patientRoutines.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Routine Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Target Area</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {patientRoutines.map(routine => (
                                <React.Fragment key={routine.routineId}>
                                    <tr>
                                        <td className="px-6 py-4 text-sm text-gray-700">{routine.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{routine.targetArea}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{routine.startDateFormatted}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{routine.endDateFormatted}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 flex gap-2">
                                            <button
                                                onClick={() => handleToggleExercises(routine.routineId)}
                                                className="bg-accent-aqua p-1 rounded-lg hover:bg-teal-500"
                                            >
                                                <img src={ic_eye} alt="View Exercises" className="h-6 w-6" />
                                            </button>
                                            <button
                                                onClick={() => confirmDeleteRoutine(routine)}
                                                className="bg-red-500 p-1 rounded-lg hover:bg-red-600"
                                            >
                                                <img src={ic_trash} alt="Delete Routine" className="h-6 w-6" />
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
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Exercise Name</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Reps</th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Duration (ms)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {routine.exercises.map((exercise, index) => (
                                                                <tr key={exercise.exerciseId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                                                                    <td className="px-6 py-4 text-sm text-gray-700">{getExerciseDetails(exercise.exerciseId)}</td>
                                                                    <td className="px-6 py-4 text-sm text-gray-700">{exercise.reps}</td>
                                                                    <td className="px-6 py-4 text-sm text-gray-700">{exercise.duration}</td>
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
                        patientId={userId}
                        isUnique={true}
                        onRoutineAdded={onRoutineAdded}
                    />
                )}

                {routineToDelete && (
                    <DeleteRoutineConfirmationModal
                        isOpen={!!routineToDelete}
                        onClose={() => setRoutineToDelete(null)}
                        onConfirm={handleDeleteRoutine}
                        routine={routineToDelete} // Pass entire routine object
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
