import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js';

const EXERCISE_URL = `${backendLink}/api/exercises`;
const CONSTRAINT_URL = `${backendLink}/api/constraints`;
const KEYPOINT_URL = `${backendLink}/api/keypoints`;

// 🔹 Get Single Exercise
const getExercise = async (exerciseId) => {
    try {
        const response = await fetch(`${EXERCISE_URL}/${exerciseId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error(`Error fetching exercise: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// 🔹 Get All Exercises
const getExercises = async () => {
    try {
        const response = await fetch(EXERCISE_URL, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error(`Error fetching exercises: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// 🔹 Save KeyPoints First (Returns KeyPoint IDs)
const saveKeypoints = async (keypoint) => {
    try {
        const response = await fetch(`${KEYPOINT_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(keypoint),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error saving keypoint: ${message}`);
        }

        return await response.json(); // Should return { keyPointId: "..." }
    } catch (error) {
        console.error(error);
        return null;
    }
};


// 🔹 Save Constraint (Uses KeyPoint IDs, Returns Constraint ID)
const saveConstraints = async (constraint) => {
    try {
        const response = await fetch(CONSTRAINT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(constraint),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error saving constraint: ${message}`);
        }

        return await response.json(); // Returns { constraintId: "..." }
    } catch (error) {
        console.error(error);
        return null;
    }
};

// 🔹 Save Exercise (Uses Constraint IDs)
const saveExercise = async (exercise) => {
        try {
            const response = await fetch(EXERCISE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(exercise),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Error adding exercise: ${message}`);
            }
            return await response.json(); // Return the created exercise
        } catch (error) {
            console.error(error);
            return null;
        }
};


// 🔹 Main Function: Saves Everything in Order
const addExerciseWithConstraints = async (exercise, constraints) => {
    try {
        const constraintIds = [];

        for (const constraint of constraints) {
            // 🔹 Save KeyPoints First
            const keypointIds = await saveKeypoints([
                constraint.pointA,
                constraint.pointB,
                constraint.pointC,
            ]);

            if (keypointIds.length !== 3) {
                throw new Error('Failed to save keypoints.');
            }

            // 🔹 Save Constraint
            const constraintData = {
                keypointIds,
                restingThreshold: constraint.restingThreshold,
                alignedThreshold: constraint.alignedThreshold,
                comparator: constraint.comparator,
            };

            const savedConstraint = await saveConstraint(constraintData);
            if (!savedConstraint || !savedConstraint.constraintId) {
                throw new Error('Failed to save constraint.');
            }

            constraintIds.push(savedConstraint.constraintId);
        }

        // 🔹 Save Exercise with Constraint IDs
        const exerciseData = {
            name: exercise.name,
            description: exercise.description,
            targetArea: exercise.targetArea,
            constraintIds,
        };

        return await saveExercise(exerciseData);
    } catch (error) {
        console.error('Error in addExerciseWithConstraints:', error);
        return null;
    }
};


// Get full exercise detail (including constraints and keypoints)
const getExerciseDetail = async (exerciseId) => {
    try {
        const response = await fetch(`${EXERCISE_URL}/detail/${exerciseId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) {
            throw new Error(`Error fetching exercise detail: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Update exercise document
const updateExercise = async (exerciseId, exercise) => {
    try {
        const response = await fetch(`${EXERCISE_URL}/${exerciseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(exercise),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error updating exercise: ${message}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Update constraint document
const updateConstraint = async (constraintId, constraint) => {
    try {
        const response = await fetch(`${CONSTRAINT_URL}/${constraintId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(constraint),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error updating constraint: ${message}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Update keypoint document
const updateKeypoint = async (keypointId, keypoint) => {
    try {
        const response = await fetch(`${KEYPOINT_URL}/${keypointId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(keypoint),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error updating keypoint: ${message}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Delete constraint document
const deleteConstraint = async (constraintId) => {
    try {
        const response = await fetch(`${CONSTRAINT_URL}/${constraintId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error(`Error deleting constraint: ${response.statusText}`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export {
    getExercise,
    getExercises,
    saveKeypoints,
    saveConstraints,
    saveExercise,
    updateExercise,
    updateConstraint,
    updateKeypoint,
    deleteConstraint,
    getExerciseDetail
};
