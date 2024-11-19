import { backendLink } from '../utils/ngrokLink.js';
const BASE_URL = `${backendLink}/api/exercises`;
//const BASE_URL = "http://localhost:7054/api/exercises";


const getExercise = async (exerciseId) => {
    try {
        const response = await fetch(`${BASE_URL}/${exerciseId}`);
        if (!response.ok) {
            throw new Error(`Error fetching exercise with ID ${exerciseId}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getExercises = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Error fetching all exercises: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

const addExercise = async (exercise) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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

const updateExercise = async (exerciseId, exercise) => {
    try {
        const response = await fetch(`${BASE_URL}/${exerciseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exercise),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error updating exercise: ${message}`);
        }
        return true; // Return true if update is successful
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteExercise = async (exerciseId) => {
    try {
        const response = await fetch(`${BASE_URL}/${exerciseId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error deleting exercise with ID ${exerciseId}: ${response.statusText}`);
        }
        return true; // Return true if delete is successful
    } catch (error) {
        console.error(error);
        return false;
    }
};

export { getExercise, getExercises, addExercise, updateExercise, deleteExercise };
