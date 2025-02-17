import React, { useState } from 'react';
import { addVisitationLog } from '../services/visitationLogService';

const AddVisitationLogModal = ({ patient, onClose, refreshLogs }) => {
    const [formData, setFormData] = useState({
        visitationDate: '',
        purposeOfVisit: '',
        therapistNotes: '',
        uid: patient.uid
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addVisitationLog(formData);
            refreshLogs();
            onClose();
        } catch (error) {
            console.error('Error adding visitation log:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h3 className="text-xl font-semibold mb-4">Add Visitation Log</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Visitation Date</label>
                        <input type="date" name="visitationDate" onChange={handleChange} className="p-2 border rounded-lg w-full" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Purpose of Visit</label>
                        <textarea name="purposeOfVisit" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Therapist Notes</label>
                        <textarea name="therapistNotes" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVisitationLogModal;
