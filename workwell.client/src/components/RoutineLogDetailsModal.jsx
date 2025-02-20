import React, { useEffect, useState } from 'react';
import { useSelfAssessmentContext } from '../hooks/useSelfAssessmentContext';
import { useVideoContext } from '../hooks/useVideoContext';
import { useJournalContext } from '../hooks/useJournalContext';
import { useExerciseContext } from '../hooks/useExerciseContext'; // Import the exercise context
import { useRoutineContext } from '../hooks/useRoutineContext'; // Import the routine context
import VideoPlayer from '../components/VideoPlayer';
import { updateRoutineLogComment } from '../services/routineLogService'; // Import API call function

const RoutineLogDetailsModal = ({ isOpen, onClose, routineLog }) => {
    const { state: selfAssessmentState } = useSelfAssessmentContext();
    const { state: videoState } = useVideoContext();
    const { state: journalState } = useJournalContext();
    const { state: exercises } = useExerciseContext(); // Access exercises from context
    const { state: routines } = useRoutineContext(); // Access routines from context

    const [selfAssessment, setSelfAssessment] = useState(null);
    const [video, setVideo] = useState(null);
    const [journal, setJournal] = useState(null);
    const [routineDetails, setRoutineDetails] = useState(null); // Routine details
    const [routineExercises, setRoutineExercises] = useState([]); // Exercises of the routine

    const [comment, setComment] = useState(routineLog?.comment || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (
            isOpen &&
            routineLog &&
            selfAssessmentState.selfAssessments &&
            videoState.videos &&
            journalState.journals &&
            routines
        ) {
            const relatedSelfAssessment = selfAssessmentState.selfAssessments.find(
                sa => sa.selfAssessmentId === routineLog.selfAssessmentId
            );
            const relatedVideo = videoState.videos.find(v => v.videoId === routineLog.videoId);
            const relatedJournal = journalState.journals.find(j => j.journalId === routineLog.journalId);

            const relatedRoutine = routines.routines.find(r => r.routineId === routineLog.routineId);

            setSelfAssessment(relatedSelfAssessment || null);
            setVideo(relatedVideo || null);
            setJournal(relatedJournal || null);
            setRoutineDetails(relatedRoutine || null);

            if (relatedRoutine) {
                const routineExercises = relatedRoutine.exercises.map(routineExercise => {
                    const exerciseDetails = exercises.exercises.find(
                        ex => ex.exerciseId === routineExercise.exerciseId
                    );
                    return {
                        ...routineExercise,
                        exerciseName: exerciseDetails ? exerciseDetails.name : 'Unknown Exercise',
                    };
                });
                setRoutineExercises(routineExercises);
            }
        }
    }, [isOpen, routineLog, selfAssessmentState, videoState, journalState, routines, exercises]);

    useEffect(() => {
        if (routineLog) {
            setComment(routineLog.comment || ""); // Reset comment when new routineLog is selected
        }
    }, [routineLog]);



    const handleSaveComment = async () => {
        setIsSaving(true);
        try {
            await updateRoutineLogComment(routineLog.routineLogId, comment);
            alert('Comment saved successfully.');
        } catch (error) {
            console.error('Failed to save comment:', error);
            alert('Failed to save comment.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !routineLog) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Routine Log Details</h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {/* General Information */}
                    <div className="text-gray-700">
                        <h3 className="font-semibold text-lg">General Information</h3>
                        <p><strong>Routine Log Name:</strong> {routineLog.routineLogName}</p>
                        <p><strong>Patient Name:</strong> {routineLog.patientName}</p>
                        <p><strong>Created At:</strong> {routineLog.createdAtDateTime}</p>
                    </div>

                    {/* Video Section */}
                    {video && (
                        <div className="text-gray-700">
                            <h3 className="font-semibold text-lg">Video</h3>
                            {video.videoUrl && <VideoPlayer publicId={video.cloudinaryId} />}
                        </div>
                    )}         

                    {/* Routine Exercises */}
                    {routineExercises.length > 0 && (
                        <div className="text-gray-700">
                            <h3 className="font-semibold text-lg">Routine Exercises</h3>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Exercise Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Reps
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            Duration (millisecond)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {routineExercises.map((exercise, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {exercise.exerciseName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {exercise.reps}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {exercise.duration}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Self-Assessment Section */}
                    {selfAssessment && (
                        <div className="text-gray-700">
                            <h3 className="font-semibold text-lg">Self-Assessment</h3>
                            <ul className="list-disc ml-6">
                                <li><strong>Awareness:</strong> {selfAssessment.awareness}</li>
                                <li><strong>Difficulty:</strong> {selfAssessment.difficulty}</li>
                                <li><strong>Pain:</strong> {selfAssessment.pain}</li>
                                <li><strong>Stiffness:</strong> {selfAssessment.stiffness}</li>
                            </ul>
                        </div>
                    )}

                    {/* Journal Section */}
                    {journal && (
                        <div className="text-gray-700">
                            <h3 className="font-semibold text-lg">Journal</h3>
                            <p className="border-l-4 border-blue-500 pl-4 text-gray-600">{journal.content}</p>
                        </div>
                    )}
                </div>

                {/*<div className="flex justify-end mt-6">*/}
                {/*    <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={onClose}>*/}
                {/*        Close*/}
                {/*    </button>*/}
                {/*</div>*/}

                {/* Comment Section */}
                {/* Comment Section */}
                <div className="mt-4">
                    <h3 className="font-semibold text-lg">Doctor's Comment</h3>
                    <textarea
                        className="w-full border rounded p-2 mt-2"
                        rows="3"
                        placeholder="Enter comment here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={handleSaveComment}
                    >
                        Save Comment
                    </button>
                </div>

                <div className="flex justify-end mt-6">
                    <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={onClose}>
                        Close
                    </button>
                </div>


            </div>
        </div>
    );
};

export default RoutineLogDetailsModal;
