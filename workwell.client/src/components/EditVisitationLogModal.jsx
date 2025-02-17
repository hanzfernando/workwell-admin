import React, { useState, useEffect } from 'react';
import { updateVisitationLog } from '../services/visitationLogService';

const EditVisitationLogModal = ({ logData, onClose, refreshLogs }) => {
    const [formData, setFormData] = useState({ ...logData });

    // Convert Firestore timestamp to YYYY-MM-DD format for date input
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            visitationDate: prevData.visitationDate ? prevData.visitationDate.split('T')[0] : ''
        }));
    }, [logData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateVisitationLog(formData.visitationLogId, formData);
            refreshLogs();
            onClose();
        } catch (error) {
            console.error('Error updating visitation log:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h3 className="text-xl font-semibold mb-4">Edit Visitation Log</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Visitation Date</label>
                        <input type="date" name="visitationDate" value={formData.visitationDate} onChange={handleChange} className="p-2 border rounded-lg w-full" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Purpose of Visit</label>
                        <textarea name="purposeOfVisit" value={formData.purposeOfVisit} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Therapist Notes</label>
                        <textarea name="therapistNotes" value={formData.therapistNotes} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVisitationLogModal;
