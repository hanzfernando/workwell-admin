import { useContext } from 'react';
import { JournalContext } from '../context/JournalContext';

const useJournalContext = () => {
    const context = useContext(JournalContext);
    if (!context) {
        throw new Error('useJournalContext must be used within a JournalProvider');
    }
    return context;
};

export { useJournalContext };
