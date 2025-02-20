import React from 'react';
import PropTypes from 'prop-types';
import { useOrganizationContext } from '../hooks/useOrganizationContext';

const AdminTable = ({ admins, onEdit }) => {
    const { state } = useOrganizationContext();

    const getOrganizationName = (organizationId) => {
        const organization = state.organizations.find((org) => org.organizationId === organizationId);
        return organization ? organization.name : 'N/A';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase">Organization</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {admins.length > 0 ? (
                        admins.map((admin) => (
                            <tr key={admin.uid}>
                                <td className="px-6 py-4 text-sm text-gray-700">{admin.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{admin.firstName} {admin.lastName}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{getOrganizationName(admin.organizationId)}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        onClick={() => onEdit(admin)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4 text-sm text-gray-700">No admins found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

AdminTable.propTypes = {
    admins: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default AdminTable;
