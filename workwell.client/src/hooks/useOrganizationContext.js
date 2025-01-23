import { OrganizationContext } from '../context/OrganizationContext';
import { useContext } from 'react';

const useOrganizationContext = () => {
    const context = useContext(OrganizationContext);

    if (!context) {
        throw new Error('useOrganizationContext must be used within an OrganizationProvider');
    }

    return context;
};

export { useOrganizationContext };
