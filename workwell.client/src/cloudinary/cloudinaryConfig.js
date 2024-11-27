import { Cloudinary } from '@cloudinary/url-gen';

const cloudinaryConfig = new Cloudinary({
    cloud: {
        cloudName: 'dmf3my3no', // Replace with your Cloudinary cloud name
    },
    url: {
        secure: true, // Use HTTPS for delivery
    },
});

export default cloudinaryConfig;
