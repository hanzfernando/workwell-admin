import { backendLink } from '../utils/ngrokLink'; // Base URL for backend API
import { getToken } from '../utils/authUtil'; // Utility to fetch the authentication token

const BASE_URL = `${backendLink}/api/organization`;

// Get all organizations
export const getAllOrganizations = async () => {
    try {
        const token = await getToken(); // Fetch the Firebase token
        const response = await fetch(`${BASE_URL}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch organizations: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching organizations:', error.message);
        throw error;
    }
};

// Get a specific organization by ID
export const getOrganizationById = async (organizationId) => {
    try {
        const token = await getToken(); // Fetch the Firebase token
        const response = await fetch(`${BASE_URL}/${organizationId}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch organization: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching organization with ID ${organizationId}:`, error.message);
        throw error;
    }
};

// Add a new organization
export const addOrganization = async (organization) => {
    try {
        const token = await getToken(); // Fetch the Firebase token
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(organization)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to add organization: ${message}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding organization:', error.message);
        throw error;
    }
};

// Update an organization
export const updateOrganization = async (organizationId, organization) => {
    try {
        const token = await getToken(); // Fetch the Firebase token
        const response = await fetch(`${BASE_URL}/${organizationId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(organization)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to update organization: ${message}`);
        }
        return true; // Indicate successful update
    } catch (error) {
        console.error(`Error updating organization with ID ${organizationId}:`, error.message);
        throw error;
    }
};

// Mark an organization as inactive
export const markOrganizationInactive = async (organizationId) => {
    try {
        const token = await getToken(); // Fetch the Firebase token
        const response = await fetch(`${BASE_URL}/${organizationId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`, // Add Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to mark organization inactive: ${message}`);
        }
        return true; // Indicate successful marking
    } catch (error) {
        console.error(`Error marking organization with ID ${organizationId} inactive:`, error.message);
        throw error;
    }
};
