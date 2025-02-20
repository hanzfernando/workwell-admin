import React, { useState } from 'react';
import AdminTable from '../components/AdminTable';
import { useAdminContext } from '../hooks/useAdminContext';
import { updateAdmin } from '../services/superAdminService';
import EditAdminModal from '../components/EditAdminModal';

const SuperAdminAdminsPage = () => {
    const { state: adminState, dispatch } = useAdminContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState(null); // For editing modal

    // Handle search query
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    // Open edit modal with selected admin
    const handleEditAdmin = (admin) => {
        setSelectedAdmin(admin);
    };

    // Update admin in context after successful edit
    const handleUpdateAdmin = async (updatedAdmin) => {
        try {
            const response = await updateAdmin(updatedAdmin.uid, updatedAdmin);
            console.log(response)
            dispatch({ type: 'UPDATE_ADMIN', payload: response.data });
            setSelectedAdmin(null); // Close modal after update
        } catch (error) {
            console.error('Failed to update admin:', error.message);
        }
    };

    // Filter admins based on search query
    const filteredAdmins = adminState.admins.filter((admin) =>
        `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
            <div className="flex justify-between items-center pb-4 mb-4 border-b">
                <h2 className="text-xl font-semibold">Admins</h2>
                <input
                    type="text"
                    placeholder="Search admins..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                />
            </div>

            <AdminTable admins={filteredAdmins} onEdit={handleEditAdmin} />

            {selectedAdmin && (
                <EditAdminModal
                    isOpen={!!selectedAdmin}
                    onClose={() => setSelectedAdmin(null)}
                    admin={selectedAdmin}
                    onUpdate={handleUpdateAdmin}
                />
            )}
        </div>
    );
};

export default SuperAdminAdminsPage;
