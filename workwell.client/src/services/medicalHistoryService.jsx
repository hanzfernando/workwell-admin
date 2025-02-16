import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/medicalHistory`;

const getMedicalHistory = async (uid) => {
    try {
        const response = await fetch(`${BASE_URL}/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to fetch medical history: ${message}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching medical history:', error.message);
        throw error;
    }
};

const addMedicalHistory = async (medicalHistoryData) => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify(medicalHistoryData),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to add medical history: ${message}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding medical history:', error.message);
        throw error;
    }
};

const updateMedicalHistory = async (id, updatedData) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to update medical history: ${message}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating medical history:', error.message);
        throw error;
    }
}

export { getMedicalHistory, addMedicalHistory, updateMedicalHistory };
