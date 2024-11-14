import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from '../firebase/firebaseConfig.js';
const BASE_URL = "https://localhost:7054/api/auth";
import { getToken, setToken} from '../utils/authUtil.js';


const signUp = async (firstName, lastName, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Get the signed-in user
        const user = userCredential.user;
        console.log("User created and verification email sent.");
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
            }),
        });
    

        const result = await response.json();
        console.log("User created and verification email sent.");
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
        // Send the ID token to your backend for verification
        const response = await fetch(`${BASE_URL}/verifyToken`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to verify token');
        }

        // Parse the response body to get the FirebaseUser data
        const userInfo = await response.json();

        // Log userInfo to check what it contains
        console.log(userInfo);

        // Return userInfo
        return userInfo;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error(error.message);
    }
};


export { signUp, logIn, verifyToken };