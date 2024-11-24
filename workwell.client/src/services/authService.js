import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '../firebase/firebaseConfig.js';
import { getToken, setToken } from '../utils/authUtil.js';
import { backendLink } from '../utils/ngrokLink.js';
const BASE_URL = `${backendLink}/api/auth`;
//const BASE_URL = "http://localhost:7054/api/auth";



const signUp = async (firstName, lastName, email, password, age, medicalCondition) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Get the signed-in user
        const user = userCredential.user;
        //console.log("User created and verification email sent.");
        //await sendEmailVerification(user)


        // Step 1: Send signup request to backend (No user creation here)
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: user.uid,
                email,
                firstName,
                lastName,
                password,
                medicalCondition,
                age
            }),
        });
    

        const result = await response.json();

        //console.log("User created and verification email sent.");
        await sendEmailVerification(user);

        return result;

     
    } catch (error) {
        console.error("Error during signup:", error.message);
    }
};


// Method to handle login
const logIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
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