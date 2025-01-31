import { useState, useEffect } from "react";
import { usePatientContext } from "../hooks/usePatientContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAdminContext } from "../hooks/useAdminContext";

const AddPatientModal = ({ isOpen, onClose, onAddPatient }) => {
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [medicalCondition, setMedicalCondition] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [address, setAddress] = useState('');
    const [assignedProfessional, setAssignedProfessional] = useState('');

    const { dispatch } = usePatientContext();
    const { user } = useAuthContext();
    const { state: adminState } = useAdminContext();

    const [error, setError] = useState(null);

    useEffect(() => {
        if (user.role === "Admin") {
            setAssignedProfessional(user.userId);
        }
    }, [user.role, user.uid]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

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

        if (user.role === "Admin") {
            setAssignedProfessional(user.userId);
        }

        if (!assignedProfessional) {
            setError("Please assign a professional.");
            return;
        }

        try {
            const newPatient = {
                firstName,
                lastName,
                email,
                contact,
                password,
                age: parseInt(age),
                medicalCondition,
                height: parseFloat(height),
                weight: parseFloat(weight),
                address,
                assignedProfessional,
            };
            onAddPatient(newPatient);

            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setFirstName('');
            setLastName('');
            setAge('');
            setMedicalCondition('');
            setHeight('');
            setWeight('');
            setAddress('');
            setAssignedProfessional('');
            setError(null);

            onClose();
        } catch (error) {
            console.error(error);
            setError(error.message || "An error occurred.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Add New Patient</h3>
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contact</label>
                        <input
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                required
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
                                required
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
                                required
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
                            required
                        />
                    </div>

                    {user.role === "AdminAssistant" && (
                        <div>
                            <label className="block text-sm font-medium">Assign to Professional</label>
                            <select
                                value={assignedProfessional}
                                onChange={(e) => setAssignedProfessional(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
                                required
                            >
                                <option value="">Select Admin</option>
                                {adminState.admins.map((admin) => (
                                    <option key={admin.uid} value={admin.uid}>
                                        {admin.firstName} {admin.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-4">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600">Add Patient</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
