import { useAuthContext } from './useAuthContext';
import { auth } from '../firebase/firebaseConfig';
import { removeToken } from '../utils/authUtil';

const useLogout = () => {
    const { dispatch } = useAuthContext();

    const logout = async () => {
        try {
            await auth.signOut();
            removeToken();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    };

    return { logout };
};

export { useLogout };
