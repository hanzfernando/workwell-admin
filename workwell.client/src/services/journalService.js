import { backendLink } from '../utils/ngrokLink.js'; // Replace with your actual backend link
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/journals`;

const getAllJournals = async () => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch journals');
        }

        const journals = await response.json();
        return journals;
    } catch (error) {
        console.error('Error fetching journals:', error.message);
        throw error;
    }
};

export { getAllJournals };
