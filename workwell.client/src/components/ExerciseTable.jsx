import React from 'react';
import ic_eye from '../assets/ic_eye.svg';

const ExerciseTable = ({ exercises }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                            Target Area
                        </th>
                        {/*<th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">*/}
                        {/*    Created Date*/}
                        {/*</th>*/}
                        {/*<th className="px-6 py-3 text-center text-xs font-medium text-neutral-dark uppercase tracking-wider">*/}
                        {/*    Actions*/}
                        {/*</th>*/}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {exercises.length > 0 ? (
                        exercises.map((exercise) => (
                            <tr key={exercise.exerciseId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.targetArea}</td>
                                {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(exercise.createdAt).toLocaleDateString()}</td>*/}
                                {/*<td className="px-6 py-4 whitespace-nowrap text-center">*/}
                                {/*    <button className="bg-accent-aqua p-1 rounded-lg">*/}
                                {/*        <img src={ic_eye} alt="View" className="h-6 w-6" />*/}
                                {/*    </button>*/}
                                {/*</td>*/}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4 text-sm text-gray-700">No exercises found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExerciseTable;
