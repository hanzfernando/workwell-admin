import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { logIn, verifyToken, } from '../services/authService';
//import { useNavigate } from "react-router-dom"

import { setToken, getToken } from '../utils/authUtil';

const useLogin = () => {
    const { dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const { idToken } = await logIn(email, password);
            // Store token and user UID in localStorage or context if needed
            setToken(idToken);
            const storedToken = getToken();
            const user = await verifyToken(storedToken);
            //localStorage.setItem('userUid', user.uid);

            // Dispatch login action
            dispatch({
                type: 'LOGIN',
                payload: { user, token: storedToken },
            });

            //setLoading(false);
            //window.location.reload();
            // Navigate to the dashboard after login
            //navigate('/dashboard', { replace: true }); // Navigate after state is updated
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };


    return { login, loading, error };
}

export { useLogin };