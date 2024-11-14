import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import PatientTable from '../components/PatientTable'

const UsersPage = () => {
    const { user } = useAuthContext();
    const { state, dispatch } = usePatientContext();

    useEffect(() => {
    }, []);

    return (
        <div>
            <div className="font-medium text-lg">
                <h1>Hello, {user.displayName}</h1>
            </div>
            <div className="bg-white w-full h-full mt-4 p-4 rounded-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Patients</h2>
                    <div className="flex space-x-2">
                        <button className="flex items-center bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                            <span className="text-lg mr-2">+</span> Add Patient
                        </button>
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>
                </div>
                <PatientTable />
            </div>
        </div>
    )
}

export default UsersPage