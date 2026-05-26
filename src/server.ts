import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import config from './config';
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
})

connectDB();

export default app;