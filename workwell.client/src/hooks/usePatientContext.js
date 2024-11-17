import { PatientContext } from "../context/PatientContext";
import { useContext } from "react";

const usePatientContext = () => {
    const context = useContext(PatientContext);

    if (!context) {
        throw new Error('usePatientContext must be used within an PatientProvider');
    }

    return context;
}

export { usePatientContext };