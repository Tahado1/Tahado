import  initiateApp  from "./src/utils/initiateApp.js";

import express from 'express';
import path from 'path'
import { config } from "dotenv";
config({path:path.resolve('config/config.env')})



const app = express()
app.use(express.json());
initiateApp(app,express)