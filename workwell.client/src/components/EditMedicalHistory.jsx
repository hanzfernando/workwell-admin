import React, { useState } from 'react';
import { updateMedicalHistory } from '../services/medicalHistoryService';

const EditMedicalHistory = ({ historyData, onClose, refreshHistory }) => {
    const [formData, setFormData] = useState({ ...historyData });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMedicalHistory(formData.medicalHistoryId, formData);
            refreshHistory(); // Refresh the history list
            onClose();
        } catch (error) {
            console.error('Error updating medical history:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h3 className="text-xl font-semibold mb-4">Edit Medical History</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Past Injuries</label>
                        <textarea
                            name="pastInjuries"
                            value={formData.pastInjuries}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Chronic Conditions</label>
                        <textarea
                            name="chronicConditions"
                            value={formData.chronicConditions}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Previous Treatments</label>
                        <textarea
                            name="previousTreatments"
                            value={formData.previousTreatments}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Surgeries</label>
                        <textarea
                            name="surgeries"
                            value={formData.surgeries}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Family Medical History</label>
                        <textarea
                            name="familyMedicalHistory"
                            value={formData.familyMedicalHistory}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            rows="3"
                        />
                    </div>

                    <div className="md:col-span-2 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMedicalHistory;
