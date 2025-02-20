import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddConstraintComponent from '../components/AddConstraintComponent.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';
import { uploadVideo } from '../services/videoService.js';
import { useVideoContext } from '../hooks/useVideoContext.jsx'
import img_keypoints from '../assets/img_pose_landmarks.png';
import {
    getExerciseDetail,
    updateExercise,
    updateConstraint,
    updateKeypoint,
    deleteConstraint,
    saveKeypoints,
    saveConstraints
} from '../services/exerciseService';

const EditExerciseModal = ({ isOpen, onClose, onUpdate, exerciseId }) => {
    const { state: videoState } = useVideoContext();
    const [exerciseDetail, setExerciseDetail] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetArea, setTargetArea] = useState('');
    const [constraints, setConstraints] = useState([]);
    const [videoId, setVideoId] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [removedConstraintIds, setRemovedConstraintIds] = useState([]);
    const [showConstraintForm, setShowConstraintForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editingConstraint, setEditingConstraint] = useState(null);
    const [videoDetails, setVideoDetails] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const detail = await getExerciseDetail(exerciseId);
            if (detail) {
                setExerciseDetail(detail);
                setName(detail.exercise.name);
                setDescription(detail.exercise.description);
                setTargetArea(detail.exercise.targetArea);
                setVideoId(detail.exercise.videoId);
                const transformedConstraints = (detail.constraints || []).map(c => ({
                    restingThreshold: c.constraint.restingThreshold,
                    alignedThreshold: c.constraint.alignedThreshold,
                    restingComparator: c.constraint.restingComparator,
                    alignedComparator: c.constraint.alignedComparator || '',
                    constraintId: c.constraint.constraintId,
                    pointA: c.keyPoints[0],
                    pointB: c.keyPoints[1],
                    pointC: c.keyPoints[2]
                }));
                setConstraints(transformedConstraints);
                // Find video details using cloudinaryId
                const videoInfo = videoState.videos.find(video => video.videoId === detail.exercise.videoId);
                console.log(videoInfo);
                setVideoDetails(videoInfo || null);
            }
        };
        if (exerciseId) fetchDetail();
    }, [exerciseId, videoState.videos]);

    const handleSaveConstraint = (newConstraint) => {
        if (editIndex !== null) {
            const updatedConstraints = [...constraints];
            updatedConstraints[editIndex] = newConstraint;
            setConstraints(updatedConstraints);
            setEditIndex(null);
        } else {
            setConstraints([...constraints, newConstraint]);
        }
        setShowConstraintForm(false);
        setEditingConstraint(null);
    };

    const handleDeleteConstraint = (index) => {
        const removed = constraints[index];
        if (removed?.constraintId) {
            setRemovedConstraintIds(prev => [...prev, removed.constraintId]);
        }
        setConstraints(constraints.filter((_, i) => i !== index));
    };

    const handleVideoUpload = async () => {
        if (!videoFile) return;
        setUploading(true);
        try {
            const response = await uploadVideo(videoFile);
            if (response?.videoId) {
                setVideoId(response.videoId);
                alert('Video uploaded successfully!');
            } else {
                alert('Failed to upload video.');
            }
        } catch (error) {
            console.error('Video upload error:', error);
            alert('Error uploading video.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateExercise = async () => {
        if (!name || !targetArea) {
            alert('Name and Target Area are required.');
            return;
        }

        try {
            for (let composite of constraints) {
                for (const pointKey of ['pointA', 'pointB', 'pointC']) {
                    const kp = composite[pointKey];
                    if (kp?.keypointId) {
                        await updateKeypoint(kp.keypointId, kp);
                    } else {
                        const keypointResponse = await saveKeypoints(kp);
                        if (keypointResponse?.keypointId) {
                            kp.keypointId = keypointResponse.keypointId;
                        }
                    }
                }

                const updatedConstraint = {
                    constraintId: composite.constraintId,
                    alignedThreshold: composite.alignedThreshold,
                    restingThreshold: composite.restingThreshold,
                    restingComparator: composite.restingComparator,
                    alignedComparator: composite.alignedComparator,
                    Keypoints: [
                        composite.pointA?.keypointId,
                        composite.pointB?.keypointId,
                        composite.pointC?.keypointId,
                    ].filter(Boolean)
                };

                if (updatedConstraint.constraintId) {
                    await updateConstraint(updatedConstraint.constraintId, updatedConstraint);
                } else {
                    const constraintResponse = await saveConstraints(updatedConstraint);
                    if (constraintResponse?.constraintId) {
                        composite.constraintId = constraintResponse.constraintId;
                    }
                }
            }

            for (const constraintId of removedConstraintIds) {
                await deleteConstraint(constraintId);
            }

            const updatedExercise = {
                ...exerciseDetail.exercise,
                name,
                description,
                targetArea,
                videoId,
                constraints: constraints.map(c => c.constraintId)
            };

            const updatedResponse = await updateExercise(exerciseId, updatedExercise);
            if (updatedResponse) {
                onUpdate(updatedResponse);
                onClose();
            } else {
                alert('Failed to update exercise.');
            }
        } catch (error) {
            console.error('Error updating exercise:', error);
            alert('Failed to update exercise.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Edit Exercise</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Target Area</label>
                        <select
                            value={targetArea}
                            onChange={(e) => setTargetArea(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        >
                            <option value="">Select Target Area</option>
                            <option value="Neck">Neck</option>
                            <option value="Shoulder">Shoulder</option>
                            <option value="LowerBack">Lower Back</option>
                            <option value="Thigh">Thigh</option>
                        </select>
                    </div>

                    {/* Video Section */}
                    <div>
                        <h3 className="font-semibold text-lg">Current Video</h3>
                        {videoDetails ? (
                            <VideoPlayer publicId={videoDetails.cloudinaryId} />
                        ) : (
                            <p>No video associated with this exercise.</p>
                        )}

                        <div className="mt-2">
                            <label className="block text-sm font-medium mb-2">Replace Video</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                            />
                            <button
                                onClick={handleVideoUpload}
                                disabled={!videoFile || uploading}
                                className={`mt-2 bg-blue-500 text-white px-4 py-2 rounded ${uploading ? 'opacity-50' : 'hover:bg-blue-600'}`}
                            >
                                {uploading ? 'Uploading...' : 'Upload New Video'}
                            </button>
                        </div>
                    </div>

                    {/*Constraint Section*/}
                    <div className="mt-4">
                        <h4 className="text-md font-semibold">Keypoint Guide</h4>

                        <img src={img_keypoints} alt="Pose Landmarks" className="w-1/2 m-auto rounded-lg shadow-md" />

                        <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold">List of Constraints</h4>
                            <button
                                onClick={() => {
                                    setShowConstraintForm(prev => !prev);
                                    setEditIndex(null);
                                    setEditingConstraint(null);
                                }}
                                className="text-xl font-bold text-white bg-accent-aqua p-1 w-8 rounded-lg hover:bg-teal-500 mr-2"
                            >
                                {showConstraintForm ? '−' : '+'}
                            </button>
                        </div>

                        {showConstraintForm && (
                            <AddConstraintComponent
                                onSave={handleSaveConstraint}
                                onCancel={() => {
                                    setShowConstraintForm(false);
                                    setEditIndex(null);
                                    setEditingConstraint(null);
                                }}
                                editingConstraint={editingConstraint}
                            />
                        )}

                        {constraints.map((constraintDetail, index) => (
                            <div key={index} className="border p-3 rounded mt-2 bg-white">
                                <h5 className="font-semibold">Constraint {index + 1}</h5>
                                <p>
                                    <strong>Resting Threshold:</strong> {constraintDetail?.restingThreshold ?? 'N/A'}
                                </p>
                                <p>
                                    <strong>Aligned Threshold:</strong> {constraintDetail?.alignedThreshold ?? 'N/A'}
                                </p>
                                <p>
                                    <strong>Resting Comparator:</strong> {constraintDetail?.restingComparator}
                                </p>
                                <p>
                                    <strong>Aligned Comparator:</strong> {constraintDetail?.alignedComparator}
                                </p>
                                {/* Render the keyPoints */}
                                {constraintDetail?.pointA && (
                                    <div className="ml-4">
                                        <p>
                                            <strong>Point A Keypoint:</strong> {constraintDetail.pointA.keypoint}
                                        </p>
                                        {constraintDetail.pointA.isMidpoint && (
                                            <p>
                                                <strong>Secondary:</strong> {constraintDetail.pointA.secondaryKeypoint}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {constraintDetail?.pointB && (
                                    <div className="ml-4">
                                        <p>
                                            <strong>Point B Keypoint:</strong> {constraintDetail.pointB.keypoint}
                                        </p>
                                        {constraintDetail.pointB.isMidpoint && (
                                            <p>
                                                <strong>Secondary:</strong> {constraintDetail.pointB.secondaryKeypoint}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {constraintDetail?.pointC && (
                                    <div className="ml-4">
                                        <p>
                                            <strong>Point C Keypoint:</strong> {constraintDetail.pointC.keypoint}
                                        </p>
                                        {constraintDetail.pointC.isMidpoint && (
                                            <p>
                                                <strong>Secondary:</strong> {constraintDetail.pointC.secondaryKeypoint}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => {
                                            setEditIndex(index);
                                            setEditingConstraint(constraintDetail);
                                            setShowConstraintForm(true);
                                        }}
                                    >
                                        Edit Constraint
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDeleteConstraint(index)}
                                    >
                                        Delete Constraint
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateExercise}
                        disabled={uploading}
                        className={`bg-accent-aqua text-white px-4 py-2 rounded ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'}`}
                    >
                        {uploading ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

EditExerciseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    exerciseId: PropTypes.string.isRequired,
};

export default EditExerciseModal;
