import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditAdminModal = ({ isOpen, onClose, admin, onUpdate }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState(''); // Optional for reset

    useEffect(() => {
        if (admin) {
            setFirstName(admin.firstName);
            setLastName(admin.lastName);
        }
    }, [admin]);

    const handleSubmit = () => {
        const updatedAdmin = {
            ...admin,
            firstName,
            lastName,
            ...(password && { password }) // Include password only if provided
        };

        console.log(updatedAdmin)
        onUpdate(updatedAdmin);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Edit Admin</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">New Password (optional)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

EditAdminModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    admin: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default EditAdminModal;
