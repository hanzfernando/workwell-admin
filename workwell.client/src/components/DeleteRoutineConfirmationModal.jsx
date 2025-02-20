import React from 'react';

const DeleteRoutineConfirmationModal = ({ routine, onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Confirm Routine Deletion</h3>
                <p>Are you sure you want to delete the routine <strong>{routine.name}</strong>? This action cannot be undone.</p>
                <div className="flex justify-end mt-6 space-x-2">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteRoutineConfirmationModal;
