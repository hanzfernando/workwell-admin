import { RoutineLogContext } from "../context/RoutineLogContext";
import { useContext } from "react";

const useRoutineLogContext = () => {
    const context = useContext(RoutineLogContext);

    if (!context) {
        throw new Error('useRoutineLogsContext must be used within a RoutineLogsProvider');
    }

    return context;
};

export { useRoutineLogContext };
