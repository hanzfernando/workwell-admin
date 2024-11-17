const BASE_URL = "https://localhost:7054/api/users";

// Get all patients
const getPatients = async () => {
    try {
        const response = await fetch(`${BASE_URL}`);
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
        const response = await fetch(`${BASE_URL}/${id}`);
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

export { getPatients, getPatient };