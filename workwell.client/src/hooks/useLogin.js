import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { logIn, verifyToken } from '../services/authService';
import { removeToken, setToken } from '../utils/authUtil';

const useLogin = () => {
    const { dispatch } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { idToken } = await logIn(email, password);

            const user = await verifyToken(idToken);
            //console.log(user)
            if (user.role === 0) {
                console.log("admin")
                setToken(idToken);
                dispatch({
                    type: 'LOGIN',
                    payload: { user, token: idToken },
                });
            } else {
                throw new Error('Unauthorized access: User role not permitted');
                console.log("not admin")
                useLogout();
            }

            
        } catch (error) {
            setError(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};

export { useLogin };
