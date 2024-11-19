import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import RoutineTable from '../components/RoutineTable';
import { getAllRoutines, assignUserToRoutine, addRoutine } from '../services/routineService';
import RoutineDetailsModal from '../components/RoutineDetailsModal'; // Import the modal
import AssignRoutineModal from '../components/AssignRoutineModal';
import AddRoutineModal from '../components/AddRoutineModal';
import { useRoutineContext } from '../hooks/useRoutineContext';

const RoutinesPage = () => {
    const { user } = useAuthContext();
    const { state: { routines }, dispatch } = useRoutineContext();
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
        const filtered = routines.filter((routine) => {
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
        setSelectedRoutine(routine); // Set the selected routine data
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

    const handleRoutineAssigned = async (routine, patient) => {
        console.log(patient);
        console.log(`Routine "${routine.routineId}" assigned to patient "${patient.uid}".`);

        try {
            const success = await assignUserToRoutine(routine.routineId, patient.uid);
            if (success) {
                console.log(`Routine "${routine.name}" successfully assigned to patient "${patient.lastName}".`);

                // Update the assigned routine in the state
                setRoutines((prevRoutines) =>
                    prevRoutines.map((r) =>
                        r.routineId === routine.routineId
                            ? { ...r, assignedTo: patient.uid }
                            : r
                    )
                );

                setFilteredRoutines((prevFilteredRoutines) =>
                    prevFilteredRoutines.map((r) =>
                        r.routineId === routine.routineId
                            ? { ...r, assignedTo: patient.uid }
                            : r
                    )
                );

                // Optionally close the modal
                handleCloseAssignModal();
            } else {
                console.error(`Failed to assign routine "${routine.name}" to patient "${patient.lastName}".`);
            }
        } catch (error) {
            console.error(`An error occurred while assigning routine "${routine.name}" to patient "${patient.lastName}":`, error);
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
