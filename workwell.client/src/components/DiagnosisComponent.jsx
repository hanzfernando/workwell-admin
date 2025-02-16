import React, { useState, useEffect } from 'react';
import icPlus from '../assets/ic_plus.svg';
import AddDiagnosis from './AddDiagnosis';
import EditDiagnosis from './EditDiagnosis';
import { getDiagnoses } from '../services/diagnosisService';

const DiagnosisComponent = ({ patient }) => {
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [diagnoses, setDiagnoses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch diagnoses when the component loads
    const fetchDiagnoses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDiagnoses(patient.uid);
            setDiagnoses(data || []);
        } catch (error) {
            console.error('Error fetching diagnoses:', error);
            setError('Failed to load diagnoses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiagnoses();
    }, [patient.uid]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Diagnosis</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    <img src={icPlus} alt="Add" className="w-5 h-5 mr-2" />
                    Add
                </button>
            </div>

            {loading ? (
                <p>Loading diagnoses...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : diagnoses.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="space-y-4">
                        {diagnoses.map((diagnosis) => (
                            <div key={diagnosis.diagnosisId} className="p-4 border rounded-lg shadow-sm bg-gray-100">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">Diagnosis Record</h3>
                                    <button
                                        onClick={() => {
                                            setSelectedDiagnosis(diagnosis);
                                            setEditModal(true);
                                        }}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm shadow-md hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                    <p><strong>Symptoms:</strong> {diagnosis.symptoms}</p>
                                    <p><strong>Diagnosis Result:</strong> {diagnosis.diagnosisResult}</p>
                                    <p><strong>Severity Level:</strong> {diagnosis.severityLevel}</p>
                                    <p><strong>Diagnosis Date:</strong> {new Date(diagnosis.diagnosisDate).toLocaleDateString()}</p>
                                    <p className="md:col-span-2"><strong>Recommended Ergonomic Adjustments:</strong> {diagnosis.recommendedErgonomicAdjustments}</p>
                                    <p><strong>Physical Therapy Recommendations:</strong> {diagnosis.physicalTherapyRecommendations}</p>
                                    <p><strong>Medication Prescriptions:</strong> {diagnosis.medicationPrescriptions}</p>
                                    <p><strong>Treatment Start Date:</strong> {new Date(diagnosis.treatmentPlanStartDate).toLocaleDateString()}</p>
                                    <p><strong>Follow-Up Date:</strong> {new Date(diagnosis.followUpPlan).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No diagnoses recorded.</p>
            )}

            {showModal && <AddDiagnosis patient={patient} onClose={() => setShowModal(false)} refreshDiagnoses={fetchDiagnoses} />}
            {editModal && <EditDiagnosis diagnosisData={selectedDiagnosis} onClose={() => setEditModal(false)} refreshDiagnoses={fetchDiagnoses} />}
        </div>
    );
};

export default DiagnosisComponent;
