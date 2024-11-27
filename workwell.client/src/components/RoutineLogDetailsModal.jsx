import React, { useEffect, useState } from 'react';
import { useSelfAssessmentContext } from '../hooks/useSelfAssessmentContext';
import { useVideoContext } from '../hooks/useVideoContext';
import { useJournalContext } from '../hooks/useJournalContext';
import VideoPlayer from '../components/VideoPlayer'

const RoutineLogDetailsModal = ({ isOpen, onClose, routineLog }) => {
    const { state: selfAssessmentState } = useSelfAssessmentContext();
    const { state: videoState } = useVideoContext();
    const { state: journalState } = useJournalContext();

    const [selfAssessment, setSelfAssessment] = useState(null);
    const [video, setVideo] = useState(null);
    const [journal, setJournal] = useState(null);

    const CloudinaryVideo = ({ secureUrl }) => {
        return (
            <div>
                <video controls style={{ width: '100%', height: 'auto' }}>
                    <source src={secureUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }



    useEffect(() => {
        if (
            isOpen &&
            routineLog &&
            selfAssessmentState.selfAssessments &&
            videoState.videos &&
            journalState.journals
        ) {
            const relatedSelfAssessment = selfAssessmentState.selfAssessments.find(
                sa => sa.selfAssessmentId === routineLog.selfAssessmentId
            );
            const relatedVideo = videoState.videos.find(v => v.videoId === routineLog.videoId);
            const relatedJournal = journalState.journals.find(j => j.journalId === routineLog.journalId);

            setSelfAssessment(relatedSelfAssessment || null);
            setVideo(relatedVideo || null);
            setJournal(relatedJournal || null);
        }
    }, [isOpen, routineLog, selfAssessmentState, videoState, journalState]);

    if (!isOpen || !routineLog) return null;

    console.log(video)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Routine Log Details</h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="text-gray-700">
                        <h3 className="font-semibold text-lg">General Information</h3>
                        <p><strong>Routine Log Name:</strong> {routineLog.routineLogName}</p>
                        <p><strong>Patient Name:</strong> {routineLog.patientName}</p>
                        <p><strong>Created At:</strong> {routineLog.createdAtDateTime}</p>
                    </div>

                    {video && (
                        <div className="text-gray-700">
                            <h3 className="font-semibold text-lg">Video</h3>
                            {video.videoUrl && <VideoPlayer publicId={video.cloudinaryId} />}
                        </div>
                    )}

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

                    {journal && (
                        <div className="text-gray-700">
                            <h3 className="font-semibold text-lg">Journal</h3>
                            <p className="border-l-4 border-blue-500 pl-4 text-gray-600">{journal.content}</p>
                        </div>
                    )}
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
