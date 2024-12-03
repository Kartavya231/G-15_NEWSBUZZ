// const { v2 } = require('cloudinary');

import { v2 } from 'cloudinary';

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// module.exports = { v2 };

export { v2 };