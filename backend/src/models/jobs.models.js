import mongoose, {Schema} from "mongoose";
import {User} from "../models/user.model.js"

const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    overview: {
        type:String,
        required: true,
    },
    responsiblity: {
        type:String,
        required: true,
    },
    requirment: {
        type:String,
        required: true,
    },
    coverImage: {
        type: String, // from cloudinary
        required: false
    },
    status: {
        type:String,
        default:"Active",
        enum:["Active","Hibernate"]
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps: true,
})

export const Jobs = mongoose.model("Jobs",jobSchema)