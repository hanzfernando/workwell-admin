import React, { useState, useEffect } from 'react';
import icPlus from '../assets/ic_plus.svg';
import AddVisitationLogModal from './AddVisitationLogModal.jsx';
import EditVisitationLogModal from './EditVisitationLogModal.jsx';
import { getVisitationLogs } from '../services/visitationLogService';

const VisitationLogComponent = ({ patient }) => {
    const [visitationLogs, setVisitationLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVisitationLogs(patient.uid);
            setVisitationLogs(data || []);
        } catch (error) {
            console.error('Error fetching visitation logs:', error);
            setError('Failed to load visitation logs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [patient.uid]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Visitation Logs</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    <img src={icPlus} alt="Add" className="w-5 h-5 mr-2" />
                    Add
                </button>
            </div>

            {loading ? (
                <p>Loading visitation logs...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : visitationLogs.length > 0 ? (
                <div className="space-y-4">
                    {visitationLogs.map((log) => (
                        <div key={log.visitationLogId} className="p-4 border rounded-lg shadow-sm bg-gray-100">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Visitation Record</h3>
                                <button
                                    onClick={() => {
                                        setSelectedLog(log);
                                        setEditModal(true);
                                    }}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm shadow-md hover:bg-blue-600 transition"
                                >
                                    Edit
                                </button>
                            </div>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                                <p><strong>Date:</strong> {new Date(log.visitationDate).toLocaleDateString()}</p>
                                <p><strong>Purpose:</strong> {log.purposeOfVisit}</p>
                                <p className="md:col-span-2"><strong>Therapist Notes:</strong> {log.therapistNotes}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No visitation logs recorded.</p>
            )}

            {showModal && <AddVisitationLogModal patient={patient} onClose={() => setShowModal(false)} refreshLogs={fetchLogs} />}
            {editModal && <EditVisitationLogModal logData={selectedLog} onClose={() => setEditModal(false)} refreshLogs={fetchLogs} />}
        </div>
    );
};

export default VisitationLogComponent;
