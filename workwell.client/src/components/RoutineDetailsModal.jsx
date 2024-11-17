const RoutineDetailsModal = ({ isOpen, onClose, routine }) => {
    if (!isOpen || !routine) return null;

    // Ensure routine.Exercises is always an array, even if it's undefined
    const exercises = routine.exercises || [];

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold flex-grow">Routine Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Routine Information */}
                    <div>
                        <h4 className="font-medium text-lg">{routine.name}</h4>
                        <p className="text-sm text-gray-500">Assigned To: {routine.assignedName || 'Unassigned'}</p>
                        <p className="text-sm text-gray-500">Created At: {new Date(routine.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Exercises Table */}
                    <h5 className="font-medium text-lg">Exercises</h5>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Exercise</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Reps</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sets</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rest (sec)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {exercises.length > 0 ? (
                                    exercises.map((exercise, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.exerciseName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.exerciseDescription}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.reps}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.sets}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exercise.rest} sec</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-sm text-gray-700">No exercises available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutineDetailsModal;
