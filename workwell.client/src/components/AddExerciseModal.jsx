import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddConstraintComponent from '../components/AddConstraintComponent.jsx';
import { saveKeypoints, saveConstraints } from '../services/exerciseService';
import { uploadVideo } from '../services/videoService'; // Import video upload service
import img_keypoints from '../assets/img_pose_landmarks.png';

const AddExerciseModal = ({ isOpen, onClose, onAddExercise }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetArea, setTargetArea] = useState('');
    const [constraints, setConstraints] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null); // For video preview
    const [uploading, setUploading] = useState(false);
    const [showConstraintForm, setShowConstraintForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editingConstraint, setEditingConstraint] = useState(null);

    // Handle video file change and set preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);

        // Generate preview URL
        if (file && file.type.startsWith('video/')) {
            const previewURL = URL.createObjectURL(file);
            setVideoPreview(previewURL);
        } else {
            setVideoPreview(null);
        }
    };

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

    const handleEditConstraint = (index) => {
        setEditIndex(index);
        setEditingConstraint(constraints[index]);
        setShowConstraintForm(true);
    };

    const handleDeleteConstraint = (index) => {
        setConstraints(constraints.filter((_, i) => i !== index));
    };

    // Main function to handle video upload and exercise creation
    const handleSaveExercise = async () => {
        if (!name || !targetArea) {
            alert('Name and Target Area are required.');
            return;
        }

        if (!videoFile) {
            alert('Please upload a video file.');
            return;
        }

        setUploading(true);
        let videoId = null;

        try {
            // Step 1: Upload Video
            const videoResponse = await uploadVideo(videoFile);
            if (videoResponse?.videoId) {
                videoId = videoResponse.videoId;
                console.log('Video uploaded successfully:', videoResponse);
            } else {
                throw new Error('Failed to upload video.');
            }

            // Step 2: Save Keypoints and Constraints
            let constraintIds = [];
            for (let constraint of constraints) {
                let keypointIds = [];

                for (let point of ['pointA', 'pointB', 'pointC']) {
                    const keypoint = {
                        keypoint: constraint[point].keypoint,
                        secondaryKeypoint: constraint[point].isMidpoint ? constraint[point].secondaryKeypoint : null,
                        isMidpoint: constraint[point].isMidpoint,
                    };

                    const keypointResponse = await saveKeypoints(keypoint);
                    if (!keypointResponse?.keypointId) {
                        throw new Error('Failed to save keypoint.');
                    }
                    keypointIds.push(keypointResponse.keypointId);
                }

                const constraintData = {
                    keypoints: keypointIds,
                    restingThreshold: constraint.restingThreshold,
                    alignedThreshold: constraint.alignedThreshold,
                    restingComparator: constraint.restingComparator,
                    alignedComparator: constraint.alignedComparator,
                };

                const constraintResponse = await saveConstraints(constraintData);
                if (!constraintResponse?.constraintId) {
                    throw new Error('Failed to save constraint.');
                }

                constraintIds.push(constraintResponse.constraintId);
            }

            // Step 3: Create Exercise with VideoId and Constraint IDs
            const newExercise = {
                name,
                description,
                targetArea,
                videoId,
                constraints: constraintIds,
            };

            console.log('Saving Exercise:', newExercise);
            onAddExercise(newExercise);

            // Reset form after successful creation
            setName('');
            setDescription('');
            setTargetArea('');
            setConstraints([]);
            setVideoFile(null);
            setVideoPreview(null); // Clear video preview
            onClose();
        } catch (error) {
            console.error('Failed to save exercise:', error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 border-b">
                    <h3 className="text-xl font-semibold">Add New Exercise</h3>
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

                    {/* Video Upload Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Upload Video</label>
                        <input
                            type="file"
                            accept="video/mp4"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-teal-500"
                        />
                        {videoPreview && (
                            <div className="mt-4">
                                <h4 className="text-md font-semibold">Video Preview</h4>
                                <video controls className="w-full rounded-lg shadow-md">
                                    <source src={videoPreview} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                        {uploading && <p className="text-sm text-blue-500 mt-2">Uploading video...</p>}
                    </div>

                    {/* Constraints Section */}
                    <div className="mt-4">
                        <h4 className="text-md font-semibold">Keypoint Guide</h4>

                        <img src={img_keypoints} alt="Pose Landmarks" className="w-1/2 m-auto rounded-lg shadow-md" /> 
                        <div className="flex items-center justify-between">
                            <h4 className="text-md font-semibold">List of Constraints</h4>
                            <button
                                onClick={() => {
                                    setShowConstraintForm(!showConstraintForm);
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

                        {constraints.map((constraint, index) => (
                            <div key={index} className="border p-3 rounded mt-2 bg-white">
                                <h5 className="font-semibold">Constraint {index + 1}</h5>
                                <p><strong>Point A:</strong> {constraint.pointA.keypoint}</p>
                                <p><strong>Point B:</strong> {constraint.pointB.keypoint}</p>
                                <p><strong>Point C:</strong> {constraint.pointC.keypoint}</p>
                                <p><strong>Resting Threshold:</strong> {constraint.restingThreshold}</p>
                                <p><strong>Aligned Threshold:</strong> {constraint.alignedThreshold}</p>
                                <div className="flex space-x-2 mt-2">
                                    <button
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleEditConstraint(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDeleteConstraint(index)}
                                    >
                                        Delete
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
                        onClick={handleSaveExercise}
                        disabled={uploading}
                        className={`bg-accent-aqua text-white px-4 py-2 rounded hover:bg-teal-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? 'Saving...' : 'Save Exercise'}
                    </button>
                </div>
            </div>
        </div>
    );
};

AddExerciseModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddExercise: PropTypes.func.isRequired,
};

export default AddExerciseModal;
