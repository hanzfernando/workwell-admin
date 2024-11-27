import { backendLink } from '../utils/ngrokLink.js'; // Replace with your actual backend link
const BASE_URL = `${backendLink}/api/videos`;

const getAllVideos = async () => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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

export { getAllVideos };
