import React, { useState } from 'react';
import { addDiagnosis } from '../services/diagnosisService';

const AddDiagnosis = ({ patient, onClose, refreshDiagnoses }) => {
    const [formData, setFormData] = useState({
        symptoms: '',
        diagnosisResult: '',
        severityLevel: '',
        diagnosisDate: '',
        recommendedErgonomicAdjustments: '',
        physicalTherapyRecommendations: '',
        medicationPrescriptions: '',
        treatmentPlanStartDate: '',
        followUpPlan: '',
        uid: patient.uid
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDiagnosis(formData);
            refreshDiagnoses();
            onClose();
        } catch (error) {
            console.error('Error adding diagnosis:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h3 className="text-xl font-semibold mb-4">Add Diagnosis</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Symptoms</label>
                        <textarea name="symptoms" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Diagnosis Result</label>
                        <textarea name="diagnosisResult" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Severity Level</label>
                        <textarea name="severityLevel" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Diagnosis Date</label>
                        <input type="date" name="diagnosisDate" onChange={handleChange} className="p-2 border rounded-lg w-full" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Recommended Ergonomic Adjustments</label>
                        <textarea name="recommendedErgonomicAdjustments" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Physical Therapy Recommendations</label>
                        <textarea name="physicalTherapyRecommendations" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Medication Prescriptions</label>
                        <textarea name="medicationPrescriptions" onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Treatment Plan Start Date</label>
                        <input type="date" name="treatmentPlanStartDate" onChange={handleChange} className="p-2 border rounded-lg w-full" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Follow-Up Plan</label>
                        <input type="date" name="followUpPlan" onChange={handleChange} className="p-2 border rounded-lg w-full" required />
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

export default AddDiagnosis;
