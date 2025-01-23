import React from 'react';
import PropTypes from 'prop-types';
import { useOrganizationContext } from '../hooks/useOrganizationContext';

const AdminTable = ({ admins }) => {
    const { state } = useOrganizationContext();

    // Map organizationId to organization name
    const getOrganizationName = (organizationId) => {
        const organization = state.organizations.find((org) => org.organizationId === organizationId);
        return organization ? organization.name : 'N/A';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Organization
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {admins.length > 0 ? (
                        admins.map((admin) => (
                            <tr key={admin.uid}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {admin.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {admin.firstName} {admin.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {getOrganizationName(admin.organizationId)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4 text-sm text-gray-700">
                                No admins found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

AdminTable.propTypes = {
    admins: PropTypes.array.isRequired,
};

export default AdminTable;
