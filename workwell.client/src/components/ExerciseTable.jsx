import React, { useState } from 'react';
import ic_edit from '../assets/ic_edit.svg';
import EditExerciseModal from './EditExerciseModal'; // adjust the path as needed
import ic_trash from '../assets/ic_trash.svg';
const ExerciseTable = ({ exercises, onDelete }) => {
    // Local state to control the edit modal and store the selected exercise ID
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);

    // When the Edit button is clicked, set the selected exercise ID and open the modal
    const handleEdit = (exerciseId) => {
        setSelectedExerciseId(exerciseId);
        setIsEditModalOpen(true);
    };

    // Close the modal and clear the selected exercise
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedExerciseId(null);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Target Area
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exercises.length > 0 ? (
                            exercises.map((exercise) => (
                                <tr key={exercise.exerciseId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {exercise.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                                        {exercise.description}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {exercise.targetArea}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            className="bg-accent-aqua p-1 rounded-lg w-8 hover:bg-teal-500 mr-2"
                                            onClick={() => handleEdit(exercise.exerciseId)}
                                        >
                                            <img src={ic_edit} alt="Edit Exercise" className="h-6 w-6" />
                                            
                                        </button>
                                        {/*<button*/}
                                        {/*    className="bg-red-500 p-1 rounded-lg w-8 hover:bg-red-600"*/}
                                        {/*    onClick={() => onDelete(exercise.exerciseId)}*/}
                                        {/*>*/}
                                        {/*    <img src={ic_trash} alt="Delete Exercise" className="h-6 w-6" />*/}

                                        {/*</button>*/}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-sm text-gray-700">
                                    No exercises found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Conditionally render the EditExerciseModal */}
            {isEditModalOpen && selectedExerciseId && (
                <EditExerciseModal
                    isOpen={isEditModalOpen}
                    exerciseId={selectedExerciseId}
                    onClose={closeEditModal}
                    onUpdate={(updatedExercise) => {
                        // Optionally update the exercise list or trigger a refresh here.
                        closeEditModal();
                    }}
                />
            )}
        </>
    );
};

export default ExerciseTable;
