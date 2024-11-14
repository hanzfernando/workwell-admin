import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { logIn, verifyToken } from '../services/authService';
import { setToken } from '../utils/authUtil';

const useLogin = () => {
    const { dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { idToken } = await logIn(email, password);
            setToken(idToken);

            const user = await verifyToken(idToken);
            if (user.role === 1) {
                throw new Error('Unauthorized access: User role not permitted');
            }

            dispatch({
                type: 'LOGIN',
                payload: { user, token: idToken },
            });
        } catch (error) {
            setError(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

export { useLogin };
