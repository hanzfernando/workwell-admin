import React, { useState } from 'react';
import { useExerciseContext } from '../hooks/useExerciseContext'; // Custom hook to access ExerciseContext
import ExerciseTable from '../components/ExerciseTable';
import AddExerciseModal from '../components/AddExerciseModal';
import { addExercise } from '../services/exerciseService';

const AdminExercisesPage = () => {
    const { state: orgState, dispatch } = useExerciseContext(); // Use orgState from context
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

    // Handle search query changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter exercises based on search query
    const filteredExercises = orgState.exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.targetArea.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add a new exercise
    const handleAddExercise = async (newExercise) => {
        try {
            const addedExercise = await addExercise(newExercise); // API call to add exercise
            if (addedExercise) {
                dispatch({ type: 'CREATE_EXERCISE', payload: addedExercise }); // Dispatch to context
            }
        } catch (error) {
            console.error('Error adding exercise:', error);
        }
    };

    const handleOpenAddExerciseModal = () => setIsAddExerciseModalOpen(true);
    const handleCloseAddExerciseModal = () => setIsAddExerciseModalOpen(false);

    return (
        <div>
            <div className="font-medium text-lg">
                <h1>Welcome, Admin</h1>
            </div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h2 className="text-xl font-semibold">Exercises</h2>
                    <div className="flex space-x-2">
                        <button
                            className="flex items-center bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                            onClick={handleOpenAddExerciseModal}
                        >
                            <span className="text-lg mr-2">+</span> Add Exercise
                        </button>
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={handleSearchChange} // Update search query state
                            className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>
                {orgState.loading ? (
                    <p>Loading exercises...</p>
                ) : orgState.error ? (
                    <p className="text-red-600">Error: {orgState.error}</p>
                ) : (
                    <ExerciseTable exercises={filteredExercises} /> // Pass filtered exercises to the table
                )}
            </div>

            {/* Add Exercise Modal */}
            {isAddExerciseModalOpen && (
                <AddExerciseModal
                    isOpen={isAddExerciseModalOpen}
                    onClose={handleCloseAddExerciseModal}
                    onAddExercise={handleAddExercise}
                />
            )}
        </div>
    );
};

export default AdminExercisesPage;
