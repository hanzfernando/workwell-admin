import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MEDIAPIPE_KEYPOINTS from '../utils/MediaPipeKeyPoints';

const AddConstraintComponent = ({ onSave, onCancel, editingConstraint }) => {
    const [constraint, setConstraint] = useState({
        pointA: { keypoint: '', secondaryKeypoint: '', isMidpoint: false },
        pointB: { keypoint: '', secondaryKeypoint: '', isMidpoint: false },
        pointC: { keypoint: '', secondaryKeypoint: '', isMidpoint: false },
        restingThreshold: '',
        alignedThreshold: '',
        restingComparator: 'gt',
    });

    const [errors, setErrors] = useState({});

    // Populate fields if editing an existing constraint
    useEffect(() => {
        if (editingConstraint) {
            // Check if editingConstraint already has pointA (i.e. it's already flat)
            if (editingConstraint.pointA) {
                setConstraint(editingConstraint);
            } else if (editingConstraint.constraint && editingConstraint.keyPoints) {
                // Transform composite data into the expected flat format,
                // ensuring we preserve keypointId.
                setConstraint({
                    pointA: editingConstraint.keyPoints[0]
                        ? {
                            keypoint: editingConstraint.keyPoints[0].keypoint || '',
                            secondaryKeypoint: editingConstraint.keyPoints[0].secondaryKeypoint || '',
                            isMidpoint: editingConstraint.keyPoints[0].isMidpoint || false,
                            keypointId: editingConstraint.keyPoints[0].keypointId, // Preserve keypointId
                        }
                        : { keypoint: '', secondaryKeypoint: '', isMidpoint: false, keypointId: undefined },
                    pointB: editingConstraint.keyPoints[1]
                        ? {
                            keypoint: editingConstraint.keyPoints[1].keypoint || '',
                            secondaryKeypoint: editingConstraint.keyPoints[1].secondaryKeypoint || '',
                            isMidpoint: editingConstraint.keyPoints[1].isMidpoint || false,
                            keypointId: editingConstraint.keyPoints[1].keypointId,
                        }
                        : { keypoint: '', secondaryKeypoint: '', isMidpoint: false, keypointId: undefined },
                    pointC: editingConstraint.keyPoints[2]
                        ? {
                            keypoint: editingConstraint.keyPoints[2].keypoint || '',
                            secondaryKeypoint: editingConstraint.keyPoints[2].secondaryKeypoint || '',
                            isMidpoint: editingConstraint.keyPoints[2].isMidpoint || false,
                            keypointId: editingConstraint.keyPoints[2].keypointId,
                        }
                        : { keypoint: '', secondaryKeypoint: '', isMidpoint: false, keypointId: undefined },
                    restingThreshold: editingConstraint.constraint.restingThreshold,
                    alignedThreshold: editingConstraint.constraint.alignedThreshold,
                    restingComparator: editingConstraint.constraint.restingComparator,
                    // Optionally, preserve constraintId if needed:
                    constraintId: editingConstraint.constraint.constraintId,
                });
            }
        }
    }, [editingConstraint]);



    const handleChange = (point, field, value) => {
        setConstraint(prev => {
            if (point === null) {
                // Update a top-level field
                return {
                    ...prev,
                    [field]: value
                };
            } else {
                // Update a nested field for a specific point (e.g. pointA, pointB, pointC)
                return {
                    ...prev,
                    [point]: {
                        ...prev[point],
                        [field]: value
                    }
                };
            }
        });
        // Optionally, remove errors if a valid selection is made
        if (value) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                if (point) {
                    delete newErrors[point];
                    delete newErrors[`${point}Secondary`];
                } else {
                    delete newErrors[field];
                }
                return newErrors;
            });
        }
    };


    const handleThresholdChange = (field, value) => {
        let numericValue = parseFloat(value);

        if (isNaN(numericValue)) {
            setConstraint(prev => ({ ...prev, [field]: '' }));
            return;
        }

        if (numericValue < 0) numericValue = 0;
        if (numericValue > 180) numericValue = 180;

        setConstraint(prev => ({
            ...prev,
            [field]: numericValue,
        }));

        // Remove error when a valid value is entered
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[field];
            return newErrors;
        });
    };

    const validateConstraint = () => {
        const newErrors = {};

        ['pointA', 'pointB', 'pointC'].forEach(point => {
            if (!constraint[point].keypoint) {
                newErrors[point] = 'Keypoint is required';
            }
            if (constraint[point].isMidpoint && !constraint[point].secondaryKeypoint) {
                newErrors[`${point}Secondary`] = 'Secondary Keypoint is required';
            }
        });

        if (constraint.restingThreshold === '' || isNaN(constraint.restingThreshold)) {
            newErrors.restingThreshold = 'Resting Threshold is required';
        }

        if (constraint.alignedThreshold === '' || isNaN(constraint.alignedThreshold)) {
            newErrors.alignedThreshold = 'Aligned Threshold is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateConstraint()) {
            return;
        }

        console.log("Saved Constraint:", constraint);
        onSave(constraint);
    };

    return (
        <div className="p-4 border rounded bg-gray-100 mt-2">
            <h4 className="text-md font-semibold mb-2">{editingConstraint ? 'Edit Constraint' : 'New Constraint'}</h4>

            {/* Point Sections */}
            {['pointA', 'pointB', 'pointC'].map((point) => (
                <div key={point} className="border p-3 rounded bg-white mt-2">
                    <div className="flex items-center justify-between">
                        <h5 className="font-medium">
                            {point === 'pointA' ? 'Point A' : point === 'pointB' ? 'Point B (Middle)' : 'Point C'}
                        </h5>

                        {/* Is Midpoint Checkbox beside the label */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={constraint[point].isMidpoint}
                                onChange={(e) => handleChange(point, 'isMidpoint', e.target.checked)}
                                className="mr-2"
                            />
                            <label className="text-sm">Is Midpoint</label>
                        </div>
                    </div>

                    {/* Dropdowns Side by Side */}
                    <div className="flex gap-2 mt-2">
                        <select
                            value={constraint[point].keypoint}
                            onChange={(e) => handleChange(point, 'keypoint', e.target.value)}
                            className="w-1/2 px-3 py-2 border rounded"
                        >
                            <option value="">Select Keypoint</option>
                            {MEDIAPIPE_KEYPOINTS.map((kp) => (
                                <option key={kp} value={kp}>
                                    {kp}
                                </option>
                            ))}
                        </select>

                        {constraint[point].isMidpoint && (
                            <select
                                value={constraint[point].secondaryKeypoint}
                                onChange={(e) => handleChange(point, 'secondaryKeypoint', e.target.value)}
                                className="w-1/2 px-3 py-2 border rounded"
                            >
                                <option value="">Select Secondary Keypoint</option>
                                {MEDIAPIPE_KEYPOINTS.map((kp) => (
                                    <option key={kp} value={kp}>
                                        {kp}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Error Messages */}
                    {errors[point] && <p className="text-red-500 text-sm mt-1">{errors[point]}</p>}
                    {errors[`${point}Secondary`] && <p className="text-red-500 text-sm mt-1">{errors[`${point}Secondary`]}</p>}
                </div>
            ))}

            {/* Threshold & Comparator */}
            <div className="flex justify-around mt-4">
                <div className="w-1/3">
                    <input
                        type="number"
                        min="0"
                        max="180"
                        value={constraint.restingThreshold}
                        onChange={(e) => handleThresholdChange('restingThreshold', e.target.value)}
                        className="w-full px-3 py-2 border rounded text-center"
                        placeholder="Resting Threshold (0 - 180)"
                    />
                    {errors.restingThreshold && <p className="text-red-500 text-sm mt-1">{errors.restingThreshold}</p>}
                </div>

                <div className="w-1/3">
                    <input
                        type="number"
                        min="0"
                        max="180"
                        value={constraint.alignedThreshold}
                        onChange={(e) => handleThresholdChange('alignedThreshold', e.target.value)}
                        className="w-full px-3 py-2 border rounded text-center"
                        placeholder="Aligned Threshold (0 - 180)"
                    />
                    {errors.alignedThreshold && <p className="text-red-500 text-sm mt-1">{errors.alignedThreshold}</p>}
                </div>

                <select
                    value={constraint.restingComparator}
                    onChange={(e) => handleChange(null, 'restingComparator', e.target.value)}
                    className="w-1/3 px-3 py-2 border rounded text-center"
                >
                    <option value="gt">&gt;</option>
                    <option value="lt">&lt;</option>
                </select>

            </div>

            {/* Save / Cancel Buttons */}
            <div className="mt-4 flex justify-end space-x-4">
                <button onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                    Cancel
                </button>
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {editingConstraint ? 'Update Constraint' : 'Save Constraint'}
                </button>
            </div>
        </div>
    );
};

AddConstraintComponent.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    editingConstraint: PropTypes.object,
};

export default AddConstraintComponent;
