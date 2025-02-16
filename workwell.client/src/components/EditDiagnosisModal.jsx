import React, { useState, useEffect } from 'react';
import { updateDiagnosis } from '../services/diagnosisService';

const EditDiagnosis = ({ diagnosisData, onClose, refreshDiagnoses }) => {
    const [formData, setFormData] = useState({ ...diagnosisData });

    // Convert ISO date (Firestore format) to YYYY-MM-DD format for input fields
    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            diagnosisDate: prevData.diagnosisDate ? prevData.diagnosisDate.split('T')[0] : '',
            treatmentPlanStartDate: prevData.treatmentPlanStartDate ? prevData.treatmentPlanStartDate.split('T')[0] : '',
            followUpPlan: prevData.followUpPlan ? prevData.followUpPlan.split('T')[0] : ''
        }));
    }, [diagnosisData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateDiagnosis(formData.diagnosisId, formData);
            refreshDiagnoses();
            onClose();
        } catch (error) {
            console.error('Error updating diagnosis:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h3 className="text-xl font-semibold mb-4">Edit Diagnosis</h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Symptoms</label>
                        <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Diagnosis Result</label>
                        <textarea name="diagnosisResult" value={formData.diagnosisResult} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Severity Level</label>
                        <textarea name="severityLevel" value={formData.severityLevel} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Diagnosis Date</label>
                        <input type="date" name="diagnosisDate" value={formData.diagnosisDate} onChange={handleChange} className="p-2 border rounded-lg w-full" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Recommended Ergonomic Adjustments</label>
                        <textarea name="recommendedErgonomicAdjustments" value={formData.recommendedErgonomicAdjustments} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Physical Therapy Recommendations</label>
                        <textarea name="physicalTherapyRecommendations" value={formData.physicalTherapyRecommendations} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-700">Medication Prescriptions</label>
                        <textarea name="medicationPrescriptions" value={formData.medicationPrescriptions} onChange={handleChange} className="p-2 border rounded-lg w-full" rows="3" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Treatment Plan Start Date</label>
                        <input type="date" name="treatmentPlanStartDate" value={formData.treatmentPlanStartDate} onChange={handleChange} className="p-2 border rounded-lg w-full" required />
                    </div>

                    <div>
                        <label className="block text-gray-700">Follow-Up Plan</label>
                        <input type="date" name="followUpPlan" value={formData.followUpPlan} onChange={handleChange} className="p-2 border rounded-lg w-full" required />
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

export default EditDiagnosis;
