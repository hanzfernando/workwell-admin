import React, { useEffect, useState } from 'react';
import ic_eye from '../assets/ic_eye.svg';
import ic_assign from '../assets/ic_assign.svg';
import ic_delete from '../assets/ic_trash.svg';
import DeleteRoutineConfirmationModal from './DeleteRoutineConfirmationModal';
import { getPatient } from '../services/patientService';

const RoutineTable = ({ routines, onViewRoutine, onAssignRoutine, onDeleteRoutine }) => {
    const [assignedUsers, setAssignedUsers] = useState({});
    const [routineToDelete, setRoutineToDelete] = useState(null);

    const fetchAssignedUser = async (routineId, userId) => {
        if (!userId) return "Unassigned";
        try {
            const user = await getPatient(userId);
            return `${user.firstName} ${user.lastName}`;
        } catch (error) {
            console.error(`Failed to fetch user for routine ID: ${routineId}`, error);
            return "Error retrieving user";
        }
    };

    useEffect(() => {
        const loadAssignedUsers = async () => {
            const userPromises = routines.map(async (routine) => {
                const userName = await fetchAssignedUser(routine.routineId, routine.assignedTo);
                return { routineId: routine.routineId, userName };
            });

            const users = await Promise.all(userPromises);
            const userMap = users.reduce((acc, { routineId, userName }) => {
                acc[routineId] = userName;
                return acc;
            }, {});
            setAssignedUsers(userMap);
        };

        loadAssignedUsers();
    }, [routines]);

    const handleDeleteClick = (routine) => {
        setRoutineToDelete(routine);
    };

    const confirmDelete = async () => {
        if (routineToDelete) {
            await onDeleteRoutine(routineToDelete);
            setRoutineToDelete(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Target Area</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {routines.length > 0 ? (
                        routines.map((routine) => (
                            <tr key={routine.routineId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{routine.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{routine.targetArea}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{routine.startDateFormatted}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{routine.endDateFormatted}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button onClick={() => onViewRoutine(routine)} className="bg-accent-aqua p-1 rounded-lg hover:bg-teal-500 mr-2">
                                        <img src={ic_eye} alt="View" className="h-6 w-6" />
                                    </button>
                                    <button onClick={() => onAssignRoutine(routine)} className="bg-accent-aqua p-1 rounded-lg hover:bg-teal-500 mr-2">
                                        <img src={ic_assign} alt="Assign" className="h-6 w-6" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(routine)} className="bg-red-500 p-1 rounded-lg hover:bg-red-600">
                                        <img src={ic_delete} alt="Delete" className="h-6 w-6" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No routines found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {routineToDelete && (
                <DeleteRoutineConfirmationModal
                    routine={routineToDelete}
                    onCancel={() => setRoutineToDelete(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

export default RoutineTable;
