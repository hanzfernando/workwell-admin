import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddOrganizationModal = ({ isOpen, onClose, onAddOrganization }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = () => {
        if (!name || !address || !phoneNumber) {
            alert('All fields are required.');
            return;
        }

        const newOrganization = {
            name,
            address,
            phoneNumber,
        };

        onAddOrganization(newOrganization); // Call the callback to add the organization
        setName(''); // Clear fields
        setAddress('');
        setPhoneNumber('');
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Add New Organization</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
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
                        Add Organization
                    </button>
                </div>
            </div>
        </div>
    );
};

AddOrganizationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddOrganization: PropTypes.func.isRequired,
};

export default AddOrganizationModal;
