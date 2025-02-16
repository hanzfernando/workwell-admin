import React, { useState, useEffect } from 'react';
import icPlus from '../assets/ic_plus.svg';
import AddMedicalHistory from './AddMedicalHistory';
import EditMedicalHistory from './EditMedicalHistory';
import { getMedicalHistory } from '../services/medicalHistoryService';

const MedicalHistoryComponent = ({ patient }) => {
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch medical history when the component loads
    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMedicalHistory(patient.uid);
            setMedicalHistory(data || []); // Ensure an empty array if no history exists
        } catch (error) {
            console.error('Error fetching medical history:', error);
            setError('Failed to load medical history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [patient.uid]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Medical History</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    <img src={icPlus} alt="Add" className="w-5 h-5 mr-2" />
                    Add
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <p>Loading medical history...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : medicalHistory.length > 0 ? (
                
                    <div className="space-y-4">
                        {medicalHistory.map((history) => (
                            <div key={history.medicalHistoryId} className="p-4 border rounded-lg shadow-sm bg-gray-100">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Medical History Record
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setSelectedHistory(history);
                                            setEditModal(true);
                                        }}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm shadow-md hover:bg-blue-600 transition"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                    <p><strong>Past Injuries:</strong> {history.pastInjuries || "None"}</p>
                                    <p><strong>Chronic Conditions:</strong> {history.chronicConditions || "None"}</p>
                                    <p><strong>Previous Treatments:</strong> {history.previousTreatments || "None"}</p>
                                    <p><strong>Surgeries:</strong> {history.surgeries || "None"}</p>
                                    <p className="md:col-span-2"><strong>Family History:</strong> {history.familyMedicalHistory || "None"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                
            ) : (
                <p>No medical history recorded.</p>
            )}

            {showModal && <AddMedicalHistory patient={patient} onClose={() => setShowModal(false)} refreshHistory={fetchHistory} />}
            {editModal && <EditMedicalHistory historyData={selectedHistory} onClose={() => setEditModal(false)} refreshHistory={fetchHistory} />}
        </div>
    );
};

export default MedicalHistoryComponent;
