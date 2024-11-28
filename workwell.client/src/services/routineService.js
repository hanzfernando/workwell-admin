import { backendLink } from '../utils/ngrokLink.js';

const BASE_URL = `${backendLink}/api/routines`;
//const BASE_URL = "http://localhost:7054/api/routines";

const getRoutine = async (routineId) => {
    try {
        const response = await fetch(`${BASE_URL}/${routineId}`);
        if (!response.ok) {
            throw new Error(`Error fetching routine with ID ${routineId}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

const getAllRoutines = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Error fetching all routines: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

const addRoutine = async (routine) => {
    console.log(routine)
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routine),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error adding routine: ${message}`);
        }
        return await response.json(); // Return the created routine
    } catch (error) {
        console.error(error);
        return null;
    }
};

const updateRoutine = async (routineId, routine) => {
    try {
        const response = await fetch(`${BASE_URL}/${routineId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routine),
        });
        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error updating routine: ${message}`);
        }
        return true; // Return true if update is successful
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteRoutine = async (routineId) => {
    try {
        const response = await fetch(`${BASE_URL}/${routineId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error deleting routine with ID ${routineId}: ${response.statusText}`);
        }
        return true; // Return true if delete is successful
    } catch (error) {
        console.error(error);
        return false;
    }
};
const assignUsersToRoutine = async (routineId, userIds) => {
    try {
        const response = await fetch(`${BASE_URL}/${routineId}/assign-users`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userIds),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Error assigning users to routine: ${message}`);
        }

        return true; // Return true if assignment is successful
    } catch (error) {
        console.error(error);
        return false;
    }
};



export { getRoutine, getAllRoutines, addRoutine, updateRoutine, deleteRoutine, assignUsersToRoutine };
