import { backendLink } from '../utils/ngrokLink.js'; // Replace with your actual backend link
import { getToken } from '../utils/authUtil.js';


const BASE_URL = `${backendLink}/api/selfassessments`;

const getAllSelfAssessments = async () => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`, // Add Authorization header

            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch self-assessments');
        }

        const selfAssessments = await response.json();
        return selfAssessments;
    } catch (error) {
        console.error('Error fetching self-assessments:', error.message);
        throw error;
    }
};

export { getAllSelfAssessments };
