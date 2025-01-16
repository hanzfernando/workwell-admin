import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/routinelogs`;

// Fetch all routine logs
const getRoutineLogs = async () => {
    try {
        const response = await fetch(BASE_URL, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching all routine logs: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Fetch a single routine log by ID
const getRoutineLogById = async (routineLogId) => {
    try {
        const response = await fetch(`${BASE_URL}/${routineLogId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });
        if (!response.ok) {
            throw new Error(`Error fetching routine log with ID ${routineLogId}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export { getRoutineLogs, getRoutineLogById };