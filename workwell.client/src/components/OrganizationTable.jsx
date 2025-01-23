import React from 'react';
import PropTypes from 'prop-types';

const OrganizationTable = ({ organizations }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Phone Number
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {organizations.length > 0 ? (
                        organizations.map((organization) => (
                            <tr key={organization.organizationId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {organization.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {organization.address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {organization.phoneNumber}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="3"
                                className="text-center py-4 text-sm text-gray-700"
                            >
                                No organizations found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

OrganizationTable.propTypes = {
    organizations: PropTypes.array.isRequired,
};

export default OrganizationTable;
