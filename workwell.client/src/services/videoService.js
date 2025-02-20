import { backendLink } from '../utils/ngrokLink.js'; // Replace with your actual backend link
import { getToken } from '../utils/authUtil.js';

const BASE_URL = `${backendLink}/api/videos`;

const uploadVideo = async (videoFile) => {
    try {
        const token = await getToken();
        const formData = new FormData();
        formData.append('videoFile', videoFile);

        const response = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(`Failed to upload video: ${message}`);
        }

        const data = await response.json();
        return { videoId: data.videoId }; // Ensure only videoId is returned
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

const getAllVideos = async () => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`, // Add Authorization header
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch videos');
        }

        const videos = await response.json();
        return videos;
    } catch (error) {
        console.error('Error fetching videos:', error.message);
        throw error;
    }
};

export { getAllVideos, uploadVideo };
