import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/diagnosis`;

export const getDiagnoses = async (uid) => {
    try {
        const response = await fetch(`${BASE_URL}/${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch diagnoses`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching diagnoses:', error);
        throw error;
    }
};

export const addDiagnosis = async (diagnosisData) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify(diagnosisData),
        });

        if (!response.ok) {
            throw new Error(`Failed to add diagnosis`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding diagnosis:', error);
        throw error;
    }
};

export const updateDiagnosis = async (diagnosisId, diagnosisData) => {
    try {
        const response = await fetch(`${BASE_URL}/${diagnosisId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            },
            body: JSON.stringify(diagnosisData),
        });

        if (!response.ok) {
            throw new Error(`Failed to update diagnosis`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating diagnosis:', error);
        throw error;
    }
};
