import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { signUp } from '../services/authService'; 
import { setToken } from '../utils/authUtil';

const useSignup = () => {
    const { dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signup = async (firstName, lastName, email, password) => {
        setLoading(true);
        setError(null);

        try {
            console.log(firstName, lastName, email, password);
            const idToken = await signUp(firstName, lastName, email, password); // Make sure signUp is defined in your authService
            console.log(idToken);
            setToken(idToken);

            // Optionally verify the token
            // const storedToken = getToken();

            dispatch({ type: 'LOGIN', payload: { firstName, lastName, email } });
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    return { signup, loading, error };
};

export { useSignup };
