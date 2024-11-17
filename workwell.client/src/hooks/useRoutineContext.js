import { RoutineContext } from "../context/RoutineContext";
import { useContext } from "react";

const useRoutineContext = () => {
    const context = useContext(RoutineContext);

    if (!context) {
        throw new Error('useRoutineContext must be used within an RoutineProvider');
    }

    return context;
}

export { useRoutineContext };
