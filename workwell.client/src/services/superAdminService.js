import { backendLink } from '../utils/ngrokLink'; // Replace with your backend URL utility
import { getToken } from '../utils/authUtil'; // Utility to get the Firebase authentication token

const BASE_URL = `${backendLink}/api/superadmin`;

// Create an admin account
export const createAdmin = async (adminData) => {
    try {
        console.log(adminData)
        const token = getToken(); // Fetch the Firebase token
        const response = await fetch(`${BASE_URL}/createAdmin`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json' // Set Content-Type to JSON
            },
            body: JSON.stringify(adminData) // Convert admin data to JSON
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to create admin: ${message}`);
        }

        return await response.json(); // Return the created admin details
    } catch (error) {
        console.error('Error creating admin:', error.message);
        throw error;
    }
};

// Get all admins
export const getAllAdmins = async () => {
    try {
        const token = await getToken(); // Fetch the Firebase token
        const response = await fetch(`${BASE_URL}/admins`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to fetch admins: ${message}`);
        }

        return await response.json(); // Return the list of admins
    } catch (error) {
        console.error('Error fetching admins:', error.message);
        throw error;
    }
};

export const updateAdmin = async (uid, updatedData) => {
    const token = await getToken();

    const response = await fetch(`${BASE_URL}/updateAdmin/${uid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update admin.');
    }

    return await response.json();
};
