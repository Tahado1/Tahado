import path from 'path'
import { config } from "dotenv";
config({path:path.resolve('config/config.env')})

import cloudinary from 'cloudinary'

cloudinary.v2.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
    cloud_name:process.env.CLOUD_NAME,
    secure:true
})

export default cloudinary.v2;