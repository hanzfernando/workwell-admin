import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { usePatientContext } from '../hooks/usePatientContext';
import { useExerciseContext } from '../hooks/useExerciseContext';

const AddRoutineModal = ({ isOpen, onClose, onAddRoutine }) => {
    const { state: { patients } } = usePatientContext();
    const { state: { exercises } } = useExerciseContext();

    const [routineName, setRoutineName] = useState('');
    const [targetArea, setTargetArea] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedExercises, setSelectedExercises] = useState([]); // Store full exercise data

    if (!isOpen) return null;

    const filteredPatients = patients.filter((patient) =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const exercisesForTargetArea = exercises.filter(
        (exercise) => exercise.targetArea === targetArea
    );

    const handleExerciseSelection = (exerciseId) => {
        setSelectedExercises((prevSelectedExercises) => {
            const exercise = exercises.find((ex) => ex.exerciseId === exerciseId);
            if (exercise) {
                const isSelected = prevSelectedExercises.some((ex) => ex.exerciseId === exerciseId);
                if (isSelected) {
                    return prevSelectedExercises.filter((ex) => ex.exerciseId !== exerciseId); // Deselect
                } else {
                    return [
                        ...prevSelectedExercises,
                        { exerciseId: exercise.exerciseId, name: exercise.name, reps: '', sets: '', rest: '' },
                    ]; // Select
                }
            }
            return prevSelectedExercises;
        });
    };

    const handleExerciseInputChange = (exerciseId, field, value) => {
        // Convert value to a number (or keep it as is if it's already a valid number)
        const parsedValue = value ? parseInt(value, 10) : '';

        setSelectedExercises((prevExercises) =>
            prevExercises.map((ex) =>
                ex.exerciseId === exerciseId ? { ...ex, [field]: parsedValue } : ex
            )
        );
    };

    const handleAddRoutine = () => {
        if (!routineName || !targetArea || !selectedPatient || selectedExercises.length === 0) {
            alert('Please fill all fields and make selections.');
            return;
        }

        const newRoutine = {
            name: routineName,
            targetArea,
            assignedTo: selectedPatient.uid,
            exercises: selectedExercises.map(({ exerciseId, reps, sets, rest }) => ({
                exerciseId,
                reps: reps ? reps : 0,  // Ensure it defaults to 0 if empty
                sets: sets ? sets : 0,
                rest: rest ? rest : 0,
            })),
        };

        onAddRoutine(newRoutine);
        onClose(); // Close the modal
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Add New Routine</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Routine Name</label>
                        <input
                            type="text"
                            value={routineName}
                            onChange={(e) => setRoutineName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Target Area</label>
                        <select
                            value={targetArea}
                            onChange={(e) => {
                                setTargetArea(e.target.value);
                                setSelectedExercises([]); // Clear selected exercises
                            }}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        >
                            <option value="">Select Target Area</option>
                            <option value="Neck">Neck</option>
                            <option value="Shoulder">Shoulder</option>
                            <option value="LowerBack">Lower Back</option>
                        </select>

                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Assign to Patient</label>
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500 mb-2"
                        />
                        <div className="overflow-y-auto max-h-40 border rounded">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            First Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Last Name
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Select
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPatients.map((patient) => (
                                        <tr key={patient.uid}>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {patient.firstName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {patient.lastName}
                                            </td>
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

                    {targetArea && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Exercises</label>
                            <div className="overflow-y-auto max-h-40 border rounded p-2">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Exercise
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Select
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {exercisesForTargetArea.map((exercise) => (
                                            <tr key={exercise.exerciseId}>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {exercise.name}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExercises.some((ex) => ex.exerciseId === exercise.exerciseId)}
                                                        onChange={() => handleExerciseSelection(exercise.exerciseId)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Display selected exercises with input fields */}
                    {selectedExercises.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Selected Exercises</label>
                            <div className="overflow-y-auto max-h-40 border rounded p-2">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Exercise
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Reps
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Sets
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Rest
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedExercises.map((exercise) => (
                                            <tr key={exercise.exerciseId}>
                                                <td className="px-6 py-4 text-sm text-gray-700">{exercise.name}</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={exercise.reps || ''}
                                                        onChange={(e) =>
                                                            handleExerciseInputChange(exercise.exerciseId, 'reps', e.target.value)
                                                        }
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={exercise.sets || ''}
                                                        onChange={(e) =>
                                                            handleExerciseInputChange(exercise.exerciseId, 'sets', e.target.value)
                                                        }
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        value={exercise.rest || ''}
                                                        onChange={(e) =>
                                                            handleExerciseInputChange(exercise.exerciseId, 'rest', e.target.value)
                                                        }
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddRoutine}
                        className="bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        Add Routine
                    </button>
                </div>
            </div>
        </div>
    );
};

AddRoutineModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddRoutine: PropTypes.func.isRequired,
};

export default AddRoutineModal;
