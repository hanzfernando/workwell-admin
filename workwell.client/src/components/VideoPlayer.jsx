import React from 'react';
import cloudinaryConfig from '../cloudinary/cloudinaryConfig';

const VideoPlayer = ({ publicId }) => {
    const videoUrl = cloudinaryConfig
        .video(publicId)
        .format('mp4') // Re-encode to MP4
        .quality('auto') // Optimize quality
        .toURL();

    return (
        <div className="max-w-lg mx-auto">
            <video
                controls
                className="w-full h-[300px] max-h-[400px] object-contain rounded-lg shadow-md"
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
