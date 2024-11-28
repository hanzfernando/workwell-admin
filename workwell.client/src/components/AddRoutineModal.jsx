import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useExerciseContext } from '../hooks/useExerciseContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddRoutineModal = ({ isOpen, onClose, onAddRoutine }) => {
    const { state: { exercises } } = useExerciseContext();

    const [routineName, setRoutineName] = useState('');
    const [targetArea, setTargetArea] = useState('');
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [startDate, setStartDate] = useState(null); // State for StartDate
    const [endDate, setEndDate] = useState(null); // State for EndDate

    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    if (!isOpen) return null;

    const exercisesForTargetArea = exercises.filter(
        (exercise) => exercise.targetArea === targetArea
    );

    const handleExerciseSelection = (exerciseId) => {
        setSelectedExercises((prevSelectedExercises) => {
            const exercise = exercises.find((ex) => ex.exerciseId === exerciseId);
            if (exercise) {
                const isSelected = prevSelectedExercises.some((ex) => ex.exerciseId === exerciseId);
                if (isSelected) {
                    return prevSelectedExercises.filter((ex) => ex.exerciseId !== exerciseId);
                } else {
                    return [
                        ...prevSelectedExercises,
                        { exerciseId: exercise.exerciseId, name: exercise.name, reps: 10, duration: 60 },
                    ];
                }
            }
            return prevSelectedExercises;
        });
    };

    const handleInputChange = (index, field, value) => {
        const updatedExercises = [...selectedExercises];
        updatedExercises[index][field] = value ? parseInt(value, 10) : 0;
        setSelectedExercises(updatedExercises);
    };

    const handleAddRoutine = () => {
        // Validation for routine name, target area, and exercises
        if (!routineName || !targetArea || selectedExercises.length === 0 || !startDate || !endDate) {
            setErrorMessage('Please fill all fields and make selections.');
            return;
        }

        // Ensure start date is before or the same as end date
        if (endDate < startDate) {
            setErrorMessage('End Date cannot be before Start Date.');
            return;
        }

        // Ensure both dates are valid and formatted in ISO 8601
        const formattedStartDate = startDate.toISOString(); // 
        const formattedEndDate = endDate.toISOString(); //

        const newRoutine = {
            name: routineName,
            targetArea,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            exercises: selectedExercises.map(({ exerciseId, reps, duration }) => ({
                exerciseId,
                reps: reps || 0,
                duration: duration || 0,
            })),
        };

        onAddRoutine(newRoutine);

        // Reset state
        setRoutineName('');
        setTargetArea('');
        setSelectedExercises([]);
        setStartDate(null);
        setEndDate(null);
        setErrorMessage('');

        onClose();
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
                    {/* Error message display */}
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-4">
                            {errorMessage}
                        </div>
                    )}

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
                                setSelectedExercises([]);
                            }}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        >
                            <option value="">Select Target Area</option>
                            <option value="Neck">Neck</option>
                            <option value="Shoulder">Shoulder</option>
                            <option value="LowerBack">Lower Back</option>
                            <option value="Thigh">Thigh</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select start date"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">End Date</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select end date"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
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

                    {selectedExercises.length > 0 && (
                        <div>
                            <h5 className="block text-sm font-medium mb-2">Selected Exercises</h5>
                            <div className="overflow-y-auto max-h-40 border rounded p-2">
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
                                                Duration (millisecond)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedExercises.map((exercise, index) => (
                                            <tr key={exercise.exerciseId}>
                                                <td className="px-6 py-4 text-sm text-gray-700">{exercise.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <input
                                                        type="number"
                                                        value={exercise.reps}
                                                        onChange={(e) => handleInputChange(index, 'reps', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <input
                                                        type="number"
                                                        value={exercise.duration}
                                                        onChange={(e) => handleInputChange(index, 'duration', e.target.value)}
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
