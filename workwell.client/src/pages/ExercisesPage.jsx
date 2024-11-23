import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import ExerciseTable from '../components/ExerciseTable';
import { getExercises, addExercise } from '../services/exerciseService'; // Add the addExercise function
import AddExerciseModal from '../components/AddExerciseModal'; // Import AddExerciseModal component

const ExercisesPage = () => {
    const { user } = useAuthContext();
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false); // Modal state

    // Fetch all exercises once when the component is mounted
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const result = await getExercises(); // Fetch all exercises
                setExercises(result); // Save all exercises in state
                setFilteredExercises(result); // Initially show all exercises
            } catch (error) {
                console.error('Error fetching exercises:', error);
            }
        };

        fetchExercises();
    }, []);

    // Filter exercises based on search query
    useEffect(() => {
        const filtered = exercises.filter((exercise) =>
            exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exercise.targetArea.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredExercises(filtered);
    }, [searchQuery, exercises]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Update search query
    };

    const handleAddExercise = async (newExercise) => {
        try {
            const addedExercise = await addExercise(newExercise); // Add the exercise to the backend
            if (addedExercise) {
                setExercises((prev) => [...prev, addedExercise]); // Update state with new exercise
                setFilteredExercises((prev) => [...prev, addedExercise]); // Update filtered list
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
                <h1>Hello, {user.displayName}</h1>
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
                <ExerciseTable exercises={filteredExercises} /> {/* Pass filtered exercises to the table */}
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

export default ExercisesPage;
