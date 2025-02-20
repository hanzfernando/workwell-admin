import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/users`;

// Get all patients under that professional
const getPatients = async () => {
    try {
        const response = await fetch(`${BASE_URL}/organization`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch patients.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients:", error.message);
        throw error;
    }
};

const updatePatient = async (uid, patientData) => {
    try {
        const response = await fetch(`${BASE_URL}/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify(patientData),
        });

        if (!response.ok) {
            throw new Error('Failed to update patient.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
    }
};

// 
const getAllOrganizationPatients = async () => {
    try {
        const response = await fetch(`${BASE_URL}/patients`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch patients.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients:", error.message);
        throw error;
    }
};

// Get a specific patient by ID
const getPatient = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch patient.");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patient by ID:", error.message);
        throw error;
    }
};

export { updatePatient, getPatients, getPatient, getAllOrganizationPatients };
