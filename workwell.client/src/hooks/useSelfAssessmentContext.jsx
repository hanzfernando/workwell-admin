import { useContext } from 'react';
import { SelfAssessmentContext } from '../context/SelfAssessmentContext';

const useSelfAssessmentContext = () => {
    const context = useContext(SelfAssessmentContext);
    if (!context) {
        throw new Error('useSelfAssessmentContext must be used within a SelfAssessmentProvider');
    }
    return context;
};

export { useSelfAssessmentContext };
