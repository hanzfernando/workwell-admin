import React, { useState, useEffect } from "react";
import { updatePatient } from "../services/patientService";
import { useAdminContext } from "../hooks/useAdminContext";

const EditPatientModal = ({ isOpen, onClose, patient, refreshPatients }) => {
    const [email, setEmail] = useState(patient?.email || '');
    const [contact, setContact] = useState(patient?.contact || '');
    const [firstName, setFirstName] = useState(patient?.firstName || '');
    const [lastName, setLastName] = useState(patient?.lastName || '');
    const [age, setAge] = useState(patient?.age || '');
    const [medicalCondition, setMedicalCondition] = useState(patient?.medicalCondition || '');
    const [height, setHeight] = useState(patient?.height || '');
    const [weight, setWeight] = useState(patient?.weight || '');
    const [address, setAddress] = useState(patient?.address || '');
    const [assignedProfessional, setAssignedProfessional] = useState(patient?.assignedProfessional || '');

    const { state: adminState } = useAdminContext();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (patient) {
            setEmail(patient.email || '');
            setContact(patient.contact || '');
            setFirstName(patient.firstName || '');
            setLastName(patient.lastName || '');
            setAge(patient.age || '');
            setMedicalCondition(patient.medicalCondition || '');
            setHeight(patient.height || '');
            setWeight(patient.weight || '');
            setAddress(patient.address || '');
            //setAssignedProfessional(patient.assignedProfessional || '');
        }
    }, [patient]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isNaN(age) || age <= 0) {
            setError("Please enter a valid age.");
            return;
        }

        if (isNaN(height) || height <= 0) {
            setError("Please enter a valid height.");
            return;
        }

        if (isNaN(weight) || weight <= 0) {
            setError("Please enter a valid weight.");
            return;
        }

        const updatedPatient = {
            firstName,
            lastName,
            email,
            contact,
            age: parseInt(age),
            medicalCondition,
            height: parseFloat(height),
            weight: parseFloat(weight),
            address,
            //assignedProfessional
        };

        try {
            await updatePatient(patient.uid, updatedPatient);
            refreshPatients();
            onClose();
        } catch (error) {
            console.error('Error updating patient:', error);
            setError(error.message || "An error occurred while updating the patient.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Edit Patient</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            required
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contact</label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Height (cm)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Weight (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Medical Condition</label>
                        <textarea
                            value={medicalCondition}
                            onChange={(e) => setMedicalCondition(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Address</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium">Assigned Professional</label>*/}
                    {/*    <select*/}
                    {/*        value={assignedProfessional}*/}
                    {/*        onChange={(e) => setAssignedProfessional(e.target.value)}*/}
                    {/*        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"*/}
                    {/*        required*/}
                    {/*    >*/}
                    {/*        <option value="">Select Professional</option>*/}
                    {/*        {adminState.admins?.map((admin) => (*/}
                    {/*            <option key={admin.uid} value={admin.uid}>*/}
                    {/*                {admin.firstName} {admin.lastName}*/}
                    {/*            </option>*/}
                    {/*        ))}*/}
                    {/*    </select>*/}
                    {/*</div>*/}

                    <div className="mt-4 flex justify-end space-x-4">
                        <button onClick={onClose} type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Patient</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPatientModal;
