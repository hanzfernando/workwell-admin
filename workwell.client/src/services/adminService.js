import { backendLink } from '../utils/ngrokLink.js';
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/users`;

const getAllOrganizationAdmins = async () => {
    try {
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/organization-admins`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to fetch organization admins: ${message}`);
        }

        return await response.json(); // Return the list of admins
    } catch (error) {
        console.error('Error fetching organization admins:', error.message);
        throw error;
    }
};

export { getAllOrganizationAdmins };