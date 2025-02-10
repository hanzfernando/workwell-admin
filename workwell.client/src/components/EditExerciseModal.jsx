import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddConstraintComponent from '../components/AddConstraintComponent.jsx';
import {
    getExerciseDetail,
    updateExercise,
    updateConstraint,
    updateKeypoint,
    deleteConstraint,
    saveKeypoints,
    saveConstraints
} from '../services/exerciseService';

const EditExerciseModal = ({ isOpen, onClose, onUpdate, exerciseId }) => {
    // Local state for the exercise detail (composite data from the API)
    const [exerciseDetail, setExerciseDetail] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetArea, setTargetArea] = useState('');
    // Constraints are stored as composite objects:
    // Each element has a "constraint" object and a "keyPoints" array.
    const [constraints, setConstraints] = useState([]);
    // Track IDs of constraints removed during editing.
    const [removedConstraintIds, setRemovedConstraintIds] = useState([]);
    const [showConstraintForm, setShowConstraintForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editingConstraint, setEditingConstraint] = useState(null);

    // Fetch full exercise detail on mount or when exerciseId changes.
    // API response structure is assumed to be:
    // { exercise: { ... }, constraints: [ { constraint: { ... }, keyPoints: [ ... ] }, ... ] }
    useEffect(() => {
        const fetchDetail = async () => {
            const detail = await getExerciseDetail(exerciseId);
            if (detail) {
                setExerciseDetail(detail);
                setName(detail.exercise.name);
                setDescription(detail.exercise.description);
                setTargetArea(detail.exercise.targetArea);
                // Transform the constraints into flat objects if needed.
                const transformedConstraints = (detail.constraints || []).map(c => {
                    // If the data is already flat (has pointA), assume it's in the correct format.
                    if (c.pointA) {
                        return c;
                    }
                    // Otherwise, if composite data is present, transform it.
                    if (c.constraint && c.keyPoints && c.keyPoints.length >= 3) {
                        return {
                            restingThreshold: c.constraint.restingThreshold,
                            alignedThreshold: c.constraint.alignedThreshold,
                            restingComparator: c.constraint.restingComparator,
                            constraintId: c.constraint.constraintId,
                            pointA: c.keyPoints[0],
                            pointB: c.keyPoints[1],
                            pointC: c.keyPoints[2]
                        };
                    }
                    return c; // Fallback in case the structure doesn't match.
                });
                setConstraints(transformedConstraints);
            }
        };
        fetchDetail();
    }, [exerciseId]);

    // Called when a constraint is saved (added or updated) via the AddConstraintComponent.
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

    // Called when the user clicks the "Edit Constraint" button.
    const handleEditConstraint = (index) => {
        setEditIndex(index);
        setEditingConstraint(constraints[index]);
        setShowConstraintForm(true);
    };

    // Called when the user deletes a constraint.
    const handleDeleteConstraint = (index) => {
        const removed = constraints[index];
        // If the removed constraint exists on the backend, track its ID for deletion.
        if (removed && removed.constraintId) {
            setRemovedConstraintIds(prev => [...prev, removed.constraintId]);
        }
        // Remove it from the constraints list.
        setConstraints(constraints.filter((_, i) => i !== index));
    };

    // Called when saving the entire exercise update.
    const simulateUpdatingToBackend = async () => {
        if (!name || !targetArea) {
            alert('Name and Target Area are required.');
            return;
        }

        try {
            // 1. Process each constraint in the flat structure.
            for (let i = 0; i < constraints.length; i++) {
                const composite = constraints[i];

                // Process each keypoint (pointA, pointB, pointC) using a for-of loop
                for (const pointKey of ['pointA', 'pointB', 'pointC']) {
                    const kp = composite[pointKey];
                    if (kp) {
                        if (kp.keypointId) {
                            // Existing keypoint: update it.
                            await updateKeypoint(kp.keypointId, kp);
                        } else {
                            // New keypoint: add it and update kp.keypointId.
                            const keypointResponse = await saveKeypoints(kp);
                            if (keypointResponse && keypointResponse.keypointId) {
                                kp.keypointId = keypointResponse.keypointId;
                            } else {
                                console.error(`Failed to add keypoint for ${pointKey}`);
                            }
                        }
                    }
                }

                // Build the updated constraint object using flat properties.
                const updatedConstraint = {
                    constraintId: composite.constraintId, // flat structure now
                    alignedThreshold: composite.alignedThreshold,
                    restingThreshold: composite.restingThreshold,
                    restingComparator: composite.restingComparator,
                    // Use "Keypoints" (with capital K) to match the C# model.
                    Keypoints: [
                        composite.pointA?.keypointId,
                        composite.pointB?.keypointId,
                        composite.pointC?.keypointId,
                    ].filter(id => id !== undefined)
                };

                if (updatedConstraint.constraintId) {
                    await updateConstraint(updatedConstraint.constraintId, updatedConstraint);
                } else {
                    // Add new constraint.
                    const constraintResponse = await saveConstraints(updatedConstraint);
                    if (constraintResponse && constraintResponse.constraintId) {
                        composite.constraintId = constraintResponse.constraintId;
                    } else {
                        console.error("Failed to add new constraint.");
                    }
                }
            }

            // 2. Process removed constraints: For each ID, call delete.
            for (const constraintId of removedConstraintIds) {
                await deleteConstraint(constraintId);
            }

            // 3. Build the updated exercise object.
            const updatedExercise = {
                ...exerciseDetail.exercise,
                name,
                description,
                targetArea,
                // The exercise model stores only an array of constraint IDs.
                constraints: constraints.map(composite => composite.constraintId)
            };

            // 4. Update the exercise on the backend.
            const updatedResponse = await updateExercise(updatedExercise.exerciseId, updatedExercise);
            if (!updatedResponse) {
                throw new Error("Failed to update exercise.");
            }
            onUpdate(updatedResponse);
            onClose();
        } catch (error) {
            console.error("Failed to update exercise:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Edit Exercise</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Basic Exercise Fields */}
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
                            <option value="Thigh">Thigh</option>
                        </select>
                    </div>

                    {/* Constraints Section */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold">List of Constraints</h4>
                            <button
                                onClick={() => {
                                    setShowConstraintForm(prev => !prev);
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

                        {constraints.map((constraintDetail, index) => (
                            <div key={index} className="border p-3 rounded mt-2 bg-white">
                                <h5 className="font-semibold">Constraint {index + 1}</h5>
                                <p>
                                    <strong>Resting Threshold:</strong> {constraintDetail?.restingThreshold ?? 'N/A'}
                                </p>
                                <p>
                                    <strong>Aligned Threshold:</strong> {constraintDetail?.alignedThreshold ?? 'N/A'}
                                </p>
                                <p>
                                    <strong>Comparator:</strong> {constraintDetail?.restingComparator ?? 'N/A'}
                                </p>
                                {/* Render the keyPoints */}
                                {constraintDetail?.pointA && (
                                    <div className="ml-4">
                                        <p>
                                            <strong>Point A Keypoint:</strong> {constraintDetail.pointA.keypoint}
                                        </p>
                                        {constraintDetail.pointA.isMidpoint && (
                                            <p>
                                                <strong>Secondary:</strong> {constraintDetail.pointA.secondaryKeypoint}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {constraintDetail?.pointB && (
                                    <div className="ml-4">
                                        <p>
                                            <strong>Point B Keypoint:</strong> {constraintDetail.pointB.keypoint}
                                        </p>
                                        {constraintDetail.pointB.isMidpoint && (
                                            <p>
                                                <strong>Secondary:</strong> {constraintDetail.pointB.secondaryKeypoint}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {constraintDetail?.pointC && (
                                    <div className="ml-4">
                                        <p>
                                            <strong>Point C Keypoint:</strong> {constraintDetail.pointC.keypoint}
                                        </p>
                                        {constraintDetail.pointC.isMidpoint && (
                                            <p>
                                                <strong>Secondary:</strong> {constraintDetail.pointC.secondaryKeypoint}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => {
                                            setEditIndex(index);
                                            setEditingConstraint(constraintDetail);
                                            setShowConstraintForm(true);
                                        }}
                                    >
                                        Edit Constraint
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDeleteConstraint(index)}
                                    >
                                        Delete Constraint
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={simulateUpdatingToBackend}
                        className="bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

EditExerciseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    exerciseId: PropTypes.string.isRequired,
};

export default EditExerciseModal;
