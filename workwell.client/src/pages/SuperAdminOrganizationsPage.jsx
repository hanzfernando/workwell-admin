import React, { useState, useEffect } from 'react';
import { getAllOrganizations, addOrganization } from '../services/OrganizationService';
import AddOrganizationModal from '../components/AddOrganizationModal';
import OrganizationTable from '../components/OrganizationTable';
import { useOrganizationContext } from '../hooks/useOrganizationContext';

const SuperAdminOrganizationsPage = () => {
    const { state: orgState, dispatch } = useOrganizationContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOrganizationModalOpen, setIsAddOrganizationModalOpen] = useState(false);

    //useEffect(() => {
    //    const fetchOrganizations = async () => {
    //        try {
    //            const result = await getAllOrganizations();
    //            setOrganizations(result);
    //        } catch (error) {
    //            console.error('Error fetching organizations:', error);
    //        }
    //    };

    //    fetchOrganizations();
    //}, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddOrganization = async (newOrganization) => {
        try {
            const addedOrg = await addOrganization(newOrganization);
            if (addedOrg) {
                dispatch({ type: 'CREATE_ORGANIZATION', payload: addedOrg });
            }
        } catch (error) {
            console.error('Error adding organization:', error);
        }
    };

    const handleOpenAddOrganizationModal = () => setIsAddOrganizationModalOpen(true);
    const handleCloseAddOrganizationModal = () => setIsAddOrganizationModalOpen(false);

    const filteredOrganizations = orgState.organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h2 className="text-xl font-semibold">Organizations</h2>
                    <div className="flex space-x-2">
                        <button
                            className="flex items-center bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                            onClick={handleOpenAddOrganizationModal}
                        >
                            <span className="text-lg mr-2">+</span> Add Organization
                        </button>
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>
                <OrganizationTable organizations={filteredOrganizations} />
            </div>

            {isAddOrganizationModalOpen && (
                <AddOrganizationModal
                    isOpen={isAddOrganizationModalOpen}
                    onClose={handleCloseAddOrganizationModal}
                    onAddOrganization={handleAddOrganization}
                />
            )}
        </div>
    );
};

export default SuperAdminOrganizationsPage;
