import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/visitationLog`;

export const getVisitationLogs = async (uid) => {
    try {
        const response = await fetch(`${BASE_URL}/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch visitation logs`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching visitation logs:', error);
        throw error;
    }
};

export const addVisitationLog = async (logData) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify(logData),
        });

        if (!response.ok) {
            throw new Error(`Failed to add visitation log`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding visitation log:', error);
        throw error;
    }
};

export const updateVisitationLog = async (logId, logData) => {
    try {
        const response = await fetch(`${BASE_URL}/${logId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify(logData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update visitation log`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating visitation log:', error);
        throw error;
    }
};

