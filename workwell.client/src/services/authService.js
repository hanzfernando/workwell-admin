import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '../firebase/firebaseConfig.js';
import { getToken, setToken } from '../utils/authUtil.js';
import { backendLink } from '../utils/ngrokLink.js';
const BASE_URL = `${backendLink}/api/auth`;
//const BASE_URL = "http://localhost:7054/api/auth";



const signUp = async (patientData) => {
    try {
        // Step 1: Create user in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, patientData.email, patientData.password);
        const user = userCredential.user;

        // Step 2: Add Firebase UID to the patient data object
        const dataToSend = { ...patientData, uid: user.uid };

        // Step 3: Register user details in the backend
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`,
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            // If backend fails, delete the Firebase user
            await user.delete();
            throw new Error(`Failed to register user in backend: ${await response.text()}`);
        }

        const result = await response.json();

        // Step 4: Send verification email only after backend succeeds
        await sendEmailVerification(user);

        return result;

    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.error("This email is already in use.");
        } else if (error.code === 'auth/invalid-email') {
            console.error("Invalid email format.");
        } else {
            console.error("Error during signup:", error.message);
        }
        return null; // Ensure to return null on failure
    }
};


// Method to handle login
const logIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken(true);
        return { idToken };
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error(error.message);
    }
};

const verifyToken = async (idToken) => {
    try {
        const response = await fetch(`${BASE_URL}/verifyToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }), // Ensure idToken is passed
        });

        if (!response.ok) {
            throw new Error('Failed to verify token');
        }

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
    }
};



export { signUp, logIn, verifyToken };