import { ExerciseContext } from "../context/ExerciseContext";
import { useContext } from "react";

const useExerciseContext = () => {
    const context = useContext(ExerciseContext);

    if (!context) {
        throw new Error('useExerciseContext must be used within an ExerciseProvider');
    }

    return context;
}

export { useExerciseContext };
