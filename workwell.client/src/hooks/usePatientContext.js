import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const useUserContext = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useAuthContext must be used within an UserProvider');
    }

    return context;
}

export { useUserContext };