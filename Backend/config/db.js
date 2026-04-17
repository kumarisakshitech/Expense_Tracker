import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://Sakshi_1234:Sakshi2005@cluster1.ta0p3sv.mongodb.net/?appName=Cluster1/ExpnseTracker")
    .then(()=> console.log("Connected to MongoDB"));

}
