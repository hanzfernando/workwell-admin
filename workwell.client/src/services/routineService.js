import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js'
const BASE_URL = `${backendLink}/api/routines`;
//const BASE_URL = "http://localhost:7054/api/routines";

const getRoutine = async (routineId) => {
    try {
        const response = await fetch(`${BASE_URL}/${routineId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });
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
        const response = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });
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
                Authorization: `Bearer ${getToken()}`, // Add Authorization header

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

const addUniqueRoutine = async (routine) => {
    console.log(routine)
    try {
        const response = await fetch(`${BASE_URL}/unique-routine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`, // Add Authorization header

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
                Authorization: `Bearer ${getToken()}`, // Add Authorization header

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
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to delete routine: ${message}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting routine:', error);
        throw error;
    }
};

const assignUsersToRoutine = async (routineId, userIds) => {
    try {
        const response = await fetch(`${BASE_URL}/${routineId}/assign-users`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`, // Add Authorization header

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

const removeUserFromRoutine = async (routineId, userId) => {
    try {
        const response = await fetch(`/api/routines/${routineId}/remove-user/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to remove user from routine. Status: ${response.status}`);
        }

        // Only parse JSON if there is content
        if (response.status !== 204 && response.headers.get('content-type')?.includes('application/json')) {
            return await response.json();
        }

        // Return success for empty response
        return { success: true };
    } catch (error) {
        console.error('Error removing user from routine:', error);
        throw error;
    }
};




export { getRoutine, getAllRoutines, addRoutine, addUniqueRoutine, updateRoutine, deleteRoutine, assignUsersToRoutine, removeUserFromRoutine };
