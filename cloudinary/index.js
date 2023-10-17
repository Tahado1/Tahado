import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: 'dze28itgl',
    api_key: '239563551255147',
    api_secret: '0NXTSga1qDqzKH_wMZZoBzEKr8A'
});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Tahado', // This is the folder name
        allowedFormats: ['jpeg', 'png', 'jpg']
    },
    secure: true
});

const upload = multer({ storage: storage });

export default {
    storage,
    upload
}