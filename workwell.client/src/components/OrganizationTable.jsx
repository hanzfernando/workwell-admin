import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditOrganizationModal from './EditOrganizationModal';
import ic_edit from '../assets/ic_edit.svg'

const OrganizationTable = ({ organizations }) => {
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const handleEditClick = (organization) => {
        setSelectedOrganization(organization);
    };

    const closeEditModal = () => {
        setSelectedOrganization(null);
    };

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
                        <th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Actions
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
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        className="bg-accent-aqua text-white p-1 rounded-md text-sm shadow-md hover:bg-teal-600 transition"
                                        onClick={() => handleEditClick(organization)}
                                    >
                                        <img src={ic_edit} alt="Edit Exercise" className="h-6 w-6" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4 text-sm text-gray-700">
                                No organizations found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedOrganization && (
                <EditOrganizationModal
                    isOpen={!!selectedOrganization}
                    onClose={closeEditModal}
                    organization={selectedOrganization}
                />
            )}
        </div>
    );
};

OrganizationTable.propTypes = {
    organizations: PropTypes.array.isRequired,
};

export default OrganizationTable;
