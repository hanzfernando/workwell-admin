import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useOrganizationContext } from '../hooks/useOrganizationContext';

const AddAdminModal = ({ isOpen, onClose, onAddAdmin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [organizationId, setOrganizationId] = useState('');

    // New state for choosing role: "Admin" or "AdminAssistant"
    const [role, setRole] = useState('');

    const { state } = useOrganizationContext();

    const handleSubmit = () => {
        if (!email || !password || !firstName || !lastName || !organizationId || !role) {
            alert('All fields are required, including Role Choice.');
            return;
        }

        const newAdmin = {
            email,
            password,
            firstName,
            lastName,
            organizationId,
            role // Pass the selected role to the parent
        };

        // Call the callback to add the admin
        onAddAdmin(newAdmin);

        // Reset fields
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setOrganizationId('');
        setRole('');

        // Close the modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Add New Admin</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Organization</label>
                        <select
                            value={organizationId}
                            onChange={(e) => setOrganizationId(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        >
                            <option value="">Select an organization</option>
                            {state.organizations.map((organization) => (
                                <option key={organization.organizationId} value={organization.organizationId}>
                                    {organization.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Role Choice Dropdown */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        >
                            <option value="">Select a Role</option>
                            <option value="Admin">Admin</option>
                            <option value="AdminAssistant">Admin Assistant</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        Add Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

AddAdminModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddAdmin: PropTypes.func.isRequired,
};

export default AddAdminModal;
