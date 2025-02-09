import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddConstraintComponent from '../components/AddConstraintComponent.jsx';
import { saveKeypoints, saveConstraints } from '../services/exerciseService'; // Import services

const AddExerciseModal = ({ isOpen, onClose, onAddExercise }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetArea, setTargetArea] = useState('');
    const [constraints, setConstraints] = useState([]);
    const [showConstraintForm, setShowConstraintForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editingConstraint, setEditingConstraint] = useState(null);

    const handleSaveConstraint = (newConstraint) => {
        if (editIndex !== null) {
            const updatedConstraints = [...constraints];
            updatedConstraints[editIndex] = newConstraint;
            setConstraints(updatedConstraints);
            setEditIndex(null);
        } else {
            setConstraints([...constraints, newConstraint]);
        }
        setShowConstraintForm(false);
        setEditingConstraint(null);
    };

    const handleEditConstraint = (index) => {
        setEditIndex(index);
        setEditingConstraint(constraints[index]);
        setShowConstraintForm(true);
    };

    const handleDeleteConstraint = (index) => {
        setConstraints(constraints.filter((_, i) => i !== index));
    };

    const simulateSavingToBackend = async () => {
        if (!name || !targetArea) {
            alert('Name and Target Area are required.');
            return;
        }

        console.log("Constraints Before Saving:", constraints);

        try {
            let constraintIds = [];

            // Step 1: Save Keypoints and Constraints
            for (let constraint of constraints) {
                let keypointIds = [];

                // Save KeyPoints One at a Time
                for (let point of ['pointA', 'pointB', 'pointC']) {
                    const keypoint = {
                        keypoint: constraint[point].keypoint,
                        secondaryKeypoint: constraint[point].isMidpoint ? constraint[point].secondaryKeypoint : null,
                        isMidpoint: constraint[point].isMidpoint,
                    };

                    console.log("Saving Keypoint:", keypoint);

                    try {
                        // Call API to save single Keypoint and store its ID
                        const keypointResponse = await saveKeypoints(keypoint);
                        console.log(keypointResponse)

                        if (!keypointResponse || !keypointResponse.keypointId) {
                            throw new Error("Failed to get KeyPoint ID from response.");
                        }
                        keypointIds.push(keypointResponse.keypointId);
                    } catch (error) {
                        console.error("Failed to save keypoint:", error);
                        return; // Stop execution if keypoint fails
                    }
                }

                // Ensure we have exactly 3 KeyPoints before proceeding
                if (keypointIds.length !== 3) {
                    console.error("Error: Not all keypoints were saved successfully.");
                    return;
                }

                // Save Constraint using the saved Keypoint IDs
                const constraintData = {
                    keypoints: keypointIds,
                    restingThreshold: constraint.restingThreshold,
                    alignedThreshold: constraint.alignedThreshold,
                    restingComparator: constraint.restingComparator,
                };

                console.log("Saving Constraint:", constraintData);

                try {
                    // Call API to save Constraint
                    const constraintResponse = await saveConstraints(constraintData);
                    console.log(constraintResponse)

                    if (!constraintResponse || !constraintResponse.constraintId) {
                        throw new Error("Failed to get Constraint ID from response.");
                    }

                    constraintIds.push(constraintResponse.constraintId);
                } catch (error) {
                    console.error("Failed to save constraint:", error);
                    return; // Stop execution if constraint fails
                }
            }

            // Step 2: Save Exercise with Constraint IDs
            const newExercise = {
                name,
                description,
                targetArea,
                constraints: constraintIds,
            };

            console.log("Saving Exercise:", newExercise);

            try {
                //const exerciseResponse = await saveExercise(newExercise);
                //if (!exerciseResponse || !exerciseResponse.exerciseId) {
                //    throw new Error("Failed to save exercise.");
                //}

                //console.log("Exercise Saved Successfully! ID:", exerciseResponse.exerciseId);

                // Step 3: Reset State
                onAddExercise(newExercise);
                setName('');
                setDescription('');
                setTargetArea('');
                setConstraints([]);
                setShowConstraintForm(false);
                setEditIndex(null);
                setEditingConstraint(null);
                onClose();
            } catch (error) {
                console.error("Failed to save exercise:", error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Add New Exercise</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Target Area</label>
                        <select
                            value={targetArea}
                            onChange={(e) => setTargetArea(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        >
                            <option value="">Select Target Area</option>
                            <option value="Neck">Neck</option>
                            <option value="Shoulder">Shoulder</option>
                            <option value="LowerBack">Lower Back</option>
                        </select>
                    </div>

                    {/* List of Constraints Section */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold">List of Constraints</h4>
                            <button
                                onClick={() => {
                                    setShowConstraintForm((prev) => !prev);
                                    setEditIndex(null);
                                    setEditingConstraint(null);
                                }}
                                className="text-xl font-bold text-gray-600 hover:text-gray-800"
                            >
                                {showConstraintForm ? '−' : '+'}
                            </button>
                        </div>

                        {showConstraintForm && (
                            <AddConstraintComponent
                                onSave={handleSaveConstraint}
                                onCancel={() => {
                                    setShowConstraintForm(false);
                                    setEditIndex(null);
                                    setEditingConstraint(null);
                                }}
                                editingConstraint={editingConstraint}
                            />
                        )}

                        {/* Constraint Boxes */}
                        {constraints.map((constraint, index) => (
                            <div key={index} className="border p-3 rounded mt-2 bg-white">
                                <h5 className="font-semibold">Constraint {index + 1}</h5>
                                <p><strong>Point A:</strong> {constraint.pointA.keypoint}</p>
                                {constraint.pointA.isMidpoint && <p><strong>Secondary A:</strong> {constraint.pointA.secondaryKeypoint}</p>}
                                <p><strong>Point B:</strong> {constraint.pointB.keypoint}</p>
                                {constraint.pointB.isMidpoint && <p><strong>Secondary B:</strong> {constraint.pointB.secondaryKeypoint}</p>}
                                <p><strong>Point C:</strong> {constraint.pointC.keypoint}</p>
                                {constraint.pointC.isMidpoint && <p><strong>Secondary C:</strong> {constraint.pointC.secondaryKeypoint}</p>}
                                <p><strong>Resting Threshold:</strong> {constraint.restingThreshold}</p>
                                <p><strong>Aligned Threshold:</strong> {constraint.alignedThreshold}</p>
                                <p><strong>Comparator:</strong> {constraint.restingComparator}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={simulateSavingToBackend} className="bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600">Save Exercise</button>
                </div>
            </div>
        </div>
    );
};

export default AddExerciseModal;
