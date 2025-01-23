import React, { useState, useEffect } from 'react';
import AddAdminModal from '../components/AddAdminModal';
import AdminTable from '../components/AdminTable';
import { useAdminContext } from '../hooks/useAdminContext';
import { useOrganizationContext } from '../hooks/useOrganizationContext';
import { getAllAdmins, createAdmin } from '../services/superAdminService';

const SuperAdminAdminsPage = () => {
    const { state: adminState, dispatch } = useAdminContext();
    const { state: orgState } = useOrganizationContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);


    //// Fetch admins from the server on component mount
    //useEffect(() => {
    //    const fetchAdmins = async () => {
    //        try {
    //            const admins = await getAllAdmins();
    //            if (admins) {
    //                dispatch({ type: 'SET_ADMINS', payload: admins.data });
    //            }
    //        } catch (error) {
    //            console.error('Error fetching admins:', error.message);
    //        }
    //    };

    //    fetchAdmins();
    //}, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddAdmin = async (newAdmin) => {
        try {
            console.log("New: ", newAdmin);
            const addedAdmin = await createAdmin(newAdmin);
            console.log("Added: ", addedAdmin);
            if (addedAdmin) {
                dispatch({ type: 'ADD_ADMIN', payload: addedAdmin.data });
            }
        } catch (error) {
            console.error('Error adding admin:', error.message);
        }
    };

    const handleOpenAddAdminModal = () => setIsAddAdminModalOpen(true);
    const handleCloseAddAdminModal = () => setIsAddAdminModalOpen(false);

    // Filter admins based on search query
    const filteredAdmins = adminState.admins.filter((admin) => {
        const organization = orgState.organizations.find(
            (org) => org.organizationId === admin.organizationId
        );
        const orgName = organization ? organization.name.toLowerCase() : '';
        return (
            admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            orgName.includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h2 className="text-xl font-semibold">Admins</h2>
                    <div className="flex space-x-2">
                        <button
                            className="flex items-center bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                            onClick={handleOpenAddAdminModal}
                        >
                            <span className="text-lg mr-2">+</span> Add Admin
                        </button>
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>
                <AdminTable admins={filteredAdmins} />
            </div>

            {isAddAdminModalOpen && (
                <AddAdminModal
                    isOpen={isAddAdminModalOpen}
                    onClose={handleCloseAddAdminModal}
                    onAddAdmin={handleAddAdmin}
                />
            )}
        </div>
    );
};

export default SuperAdminAdminsPage;
