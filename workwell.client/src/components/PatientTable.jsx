import React from 'react';
import ic_eye from '../assets/ic_eye.svg';

const PatientTable = ({ patients, onViewRoutine }) => {

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            First Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Last Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Age
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Medical Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Email
                        </th>                   
                        <th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <tr key={patient.uid}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.firstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.age}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.medicalCondition}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        className="bg-accent-aqua p-1 rounded-lg"
                                        onClick={() => onViewRoutine(patient)} // Call onViewRoutine when clicked
                                    >
                                        <img src={ic_eye} alt="View" className="h-6 w-6" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4 text-sm text-gray-700">No patients found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;
