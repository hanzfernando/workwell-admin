import React, { useState } from 'react';
import ic_eye from '../assets/ic_eye.svg'; // Eye icon
import RoutineLogDetailsModal from './RoutineLogDetailsModal'; // Import the modal component
import { usePatientContext } from '../hooks/usePatientContext';

const RoutineLogTable = ({ routineLogs }) => {
    const { state: { patients } } = usePatientContext();
    const [selectedRoutineLog, setSelectedRoutineLog] = useState(null); // State to hold selected routine log
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Helper function to get patient's full name based on uid
    const getPatientNameByUid = (uid) => {
        const patient = patients.find((p) => p.uid === uid); // Find the patient by UID
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown User'; // Return full name or fallback
    };

    const onViewRoutineLogDetail = (routineLog) => {
        const patientName = getPatientNameByUid(routineLog.uid); // Augment routineLog with patientName
        setSelectedRoutineLog({ ...routineLog, patientName }); // Set the selected log
        setIsModalOpen(true); // Open the modal
    };

    return (
        <>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Routine Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Patient Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {routineLogs.length > 0 ? (
                            routineLogs.map((log) => (
                                <tr key={log.routineLogId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.routineLogName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {getPatientNameByUid(log.uid)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {log.createdAtDateTime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button
                                            className="bg-accent-aqua p-1 rounded-lg"
                                            onClick={() => onViewRoutineLogDetail(log)} // Call onViewRoutineLogDetail when clicked
                                        >
                                            <img src={ic_eye} alt="View" className="h-6 w-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-sm text-gray-700">No routine logs found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Routine Log Details Modal */}
            <RoutineLogDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Close the modal
                routineLog={selectedRoutineLog} // Pass the selected routine log
            />
        </>
    );
};

export default RoutineLogTable;
