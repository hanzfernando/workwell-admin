import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import RoutineTable from '../components/RoutineTable';
import { getAllRoutines, assignUsersToRoutine, addRoutine } from '../services/routineService';
import RoutineDetailsModal from '../components/RoutineDetailsModal'; // Import the modal
import AssignRoutineModal from '../components/AssignRoutineModal';
import AddRoutineModal from '../components/AddRoutineModal';
import { useRoutineContext } from '../hooks/useRoutineContext';
import { useExerciseContext } from '../hooks/useExerciseContext';
import { usePatientContext } from '../hooks/usePatientContext';

const RoutinesPage = () => {
    const { user } = useAuthContext();
    const { state: { patients }, dispatch: patientDispatch } = usePatientContext();
    const { state: { routines }, dispatch } = useRoutineContext();
    const { state: { exercises } } = useExerciseContext();
    const [filteredRoutines, setFilteredRoutines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isRoutineDetailsModalOpen, setIsRoutineDetailsModalOpen] = useState(false); // Modal state for routine details
    const [selectedRoutine, setSelectedRoutine] = useState(null); // Selected routine for details

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); // Modal state for assigning routine
    const [routineToAssign, setRoutineToAssign] = useState(null); // Selected routine for assignment

    const [isAddRoutineModalOpen, setIsAddRoutineModalOpen] = useState(false); // Modal state for creating routine]
    //const [routineToAdd, setRoutineToAdd] = useState(null); // Selected routine for creation]]
    
    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const result = await getAllRoutines(); // Fetch all routines
                dispatch({ type: 'SET_ROUTINES', payload: result }); // Update context state})
            } catch (error) {
                console.error("Error fetching routines:", error);
            }
        };

        fetchRoutines();
    }, []);

    // Filter routines based on search query
    useEffect(() => {
        const filtered = routines
            .filter((routine) => !routine.isUnique)
            .filter((routine) => {
            return (
                routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                routine.assignedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                routine.targetArea.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredRoutines(filtered);
    }, [searchQuery, routines]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleViewRoutine = (routine) => {
        // Fetch exercise details from `exerciseContext`
        const detailedExercises = routine.exercises.map((exercise) => {
            // Find the exercise by its ID in the context
            const detailedExercise = exercises.find((ex) => ex.exerciseId === exercise.exerciseId);

            if (detailedExercise) {
                // Merge context details into the routine's exercise
                return {
                    ...exercise,
                    exerciseName: detailedExercise.name,
                    exerciseDescription: detailedExercise.description,
                    targetArea: detailedExercise.targetArea, // Add additional details if needed
                };
            } else {
                // If no matching exercise is found in context, return the original
                return { ...exercise };
            }
        });

        // Pass the detailed exercises to the selected routine
        setSelectedRoutine({ ...routine, exercises: detailedExercises });
        setIsRoutineDetailsModalOpen(true); // Open the routine details modal
    };


    const handleCloseRoutineDetailsModal = () => {
        setIsRoutineDetailsModalOpen(false); // Close the routine details modal
        setSelectedRoutine(null); // Clear selected routine
    };

    const handleAssignRoutine = (routine) => {
        setRoutineToAssign(routine); // Set the routine to assign
        setIsAssignModalOpen(true); // Open the assign routine modal
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false); // Close the assign routine modal
        setRoutineToAssign(null); // Clear selected routine for assignment
    };

    const handleRoutineAssigned = async (routine, userIds) => {
        console.log(userIds);
        console.log(`Routine "${routine.routineId}" assigned to users: ${userIds.join(', ')}`);

        try {
            const success = await assignUsersToRoutine(routine.routineId, userIds);
            if (success) {
                console.log(`Routine "${routine.name}" successfully updated with new user assignments.`);

                // Update the local state to reflect the new assignment
                dispatch({
                    type: 'UPDATE_ROUTINE',
                    payload: { ...routine, users: userIds },
                });

                setFilteredRoutines((prevFilteredRoutines) =>
                    prevFilteredRoutines.map((r) =>
                        r.routineId === routine.routineId ? { ...r, users: userIds } : r
                    )
                );

                // Get the current users assigned to the routine
                const currentUserIds = routine.users || [];

                // Identify added and removed user IDs
                const addedUserIds = userIds.filter((userId) => !currentUserIds.includes(userId));
                const removedUserIds = currentUserIds.filter((userId) => !userIds.includes(userId));

                // Dispatch action to update users' `Routines` list in context
                addedUserIds.forEach((userId) => {
                    console.log(`Adding routine ${routine.routineId} to user ${userId}`);
                    patientDispatch({
                        type: 'ADD_ROUTINE_TO_USER',
                        payload: { userId, routineId: routine.routineId },
                    });
                });

                // Dispatch action to remove routine from users' `Routines` list in context
                removedUserIds.forEach((userId) => {
                    console.log(`Removing routine ${routine.routineId} from user ${userId}`);
                    patientDispatch({
                        type: 'REMOVE_ROUTINE_FROM_USER',
                        payload: { userId, routineId: routine.routineId },
                    });
                });
            } else {
                console.error(`Failed to update routine "${routine.name}" with user assignments.`);
            }
        } catch (error) {
            console.error(`An error occurred while updating routine "${routine.name}" with user assignments:`, error);
        }
    };





    const handleAddRoutine = () => {
        setIsAddRoutineModalOpen(true); // Open the add routine modal
    };

    const handleCloseAddRoutineModal = () => {
        setIsAddRoutineModalOpen(false); // Close the add routine modal
    };
    

    const handleRoutineAdded = async (newRoutine) => {
        console.log('New routine added:', newRoutine);

        // Call addRoutine to send the new routine to the backend
        const addedRoutine = await addRoutine(newRoutine);
        console.log(addedRoutine);
        if (addedRoutine) {
            // Once the routine is successfully added, update state with the routine returned from the backend
            dispatch({ type: 'CREATE_ROUTINE', payload: addedRoutine });
            setFilteredRoutines((prevFilteredRoutines) => [...prevFilteredRoutines, addedRoutine]);

            // Optionally close the modal or perform other actions
            handleCloseAddRoutineModal();
        } else {
            console.error("Failed to add routine");
            // Handle the error (optional)
        }
    };



    return (
        <div>
            <div className="font-medium text-lg">
                <h1>Hello, {user.displayName}</h1>
            </div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h2 className="text-xl font-semibold">Routines</h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleAddRoutine} // Call handleAddRoutine on click
                            className="flex items-center bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                        >
                            <span className="text-lg mr-2">+</span> Add Routine
                        </button>
                        <input
                            type="text"
                            placeholder="Search routines..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>
                <RoutineTable
                    routines={filteredRoutines}
                    onViewRoutine={handleViewRoutine}
                    onAssignRoutine={handleAssignRoutine} // Pass handler for assigning
                />
            </div>

            {/* Routine Details Modal */}
            <RoutineDetailsModal
                isOpen={isRoutineDetailsModalOpen}
                onClose={handleCloseRoutineDetailsModal}
                routine={selectedRoutine}
            />

            {/* Assign Routine Modal */}
            <AssignRoutineModal
                isOpen={isAssignModalOpen}
                onClose={handleCloseAssignModal}
                routine={routineToAssign}
                onAssign={handleRoutineAssigned}
            />

            {/* Add Routine Modal */}
            <AddRoutineModal
                isOpen={isAddRoutineModalOpen} // Pass modal state
                onClose={handleCloseAddRoutineModal} // Close handler
                onAddRoutine={handleRoutineAdded} // Handle new routine addition
            />
        </div>
    );
};

export default RoutinesPage;
