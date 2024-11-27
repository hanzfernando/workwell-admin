import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllVideos } from '../services/videoService';

const initialState = {
    videos: [],
    loading: true,
    error: null,
};

const videoReducer = (state, action) => {
    switch (action.type) {
        case 'SET_VIDEOS':
            return { ...state, videos: action.payload, loading: false, error: null };
        case 'ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

const VideoContext = createContext();

const VideoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(videoReducer, initialState);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const videos = await getAllVideos();
                dispatch({ type: 'SET_VIDEOS', payload: videos });
            } catch (error) {
                dispatch({ type: 'ERROR', payload: error.message });
            }
        };
        fetchVideos();
    }, []);

    return <VideoContext.Provider value={{ state, dispatch }}>{children}</VideoContext.Provider>;
};

VideoProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { VideoContext, VideoProvider };
