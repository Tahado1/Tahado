import mongoose from "mongoose";

export const connectionDB =()=>{
    return mongoose
    .connect(process.env.DB_URL_LOCAL)
    .then((res)=>console.log("DB connection Done"))
    .catch((err)=>console.log("connection failed"))
}